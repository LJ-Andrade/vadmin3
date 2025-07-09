<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Traits\CrudOperations;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use CrudOperations;

    public function __construct(private readonly UserService $service) {}

    public function index(Request $request)
    {
        $query = $this->service->list($request->all());

        return $this->respondWithCollection(
            $request,
            $query,
            UserResource::class,
            defaultPerPage: 10
        );
    }

    public function show($id)
    {
        \Log::info("Buscando usuario con ID: {$id}");
        
        $user = User::with(['roles', 'media'])->findOrFail($id);
        
        \Log::info("Usuario encontrado:", [
            'id' => $user->id,
            'user' => $user->user,
            'email' => $user->email,
            'roles_count' => $user->roles->count(),
            'media_count' => $user->media->count()
        ]);
        
        return new UserResource($user);
    }

    public function store(Request $request)
    {   
        \Illuminate\Support\Facades\Log::info('ROLE STORE REQUEST:', $request->all());
        
        $validated = $request->validate([
            'user'   => 'required|string|max:255|unique:users,user',
            'email'      => 'required|email|max:255|unique:users,email',
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'password'   => 'required|string|min:8',
            'roles'      => 'array',
            'avatar'     => 'nullable|image|max:10000',
        ]);

        $user = $this->service->create($validated);

        // Procesar la subida del avatar si existe
        $result = $this->processAvatarUpload($user, $request);
        if ($result !== null && !$result[0]) {
            return response()->json([
                'message' => 'Error al subir la imagen: ' . $result[1],
            ], 422);
        }

        // Recargar el usuario con sus relaciones para incluir el avatar en la respuesta
        $user->load(['roles', 'media']);
        
        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => new UserResource($user)
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'user'   => "sometimes|string|max:255|unique:users,user,{$user->id}",
            'email'      => "sometimes|email|max:255|unique:users,email,{$user->id}",
            'first_name' => 'sometimes|string|max:255',
            'last_name'  => 'sometimes|string|max:255',
            'password'   => 'sometimes|string|min:8',
            'roles'      => 'sometimes|array',
            'avatar' => 'sometimes|image|max:2048',
        ]);

        $this->service->update($user, $validated);

        // Procesar la subida del avatar si existe
        $result = $this->processAvatarUpload($user, $request);
        if ($result !== null && !$result[0]) {
            return response()->json([
                'message' => 'Error al subir la imagen: ' . $result[1],
            ], 422);
        }

        // Recargar el usuario con sus relaciones para incluir el avatar en la respuesta
        $user->load(['roles', 'media']);
        
        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => new UserResource($user)
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $this->service->delete($user);
        return $this->ok(status: 204);
    }
    
    /**
     * Obtiene un mensaje descriptivo para los errores de subida de archivos
     */
    private function getUploadErrorMessage($errorCode)
    {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido por PHP (' . ini_get('upload_max_filesize') . ')',
            UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo permitido por el formulario',
            UPLOAD_ERR_PARTIAL => 'El archivo se subió parcialmente',
            UPLOAD_ERR_NO_FILE => 'No se subió ningún archivo',
            UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal',
            UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el archivo en el disco',
            UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida del archivo'
        ];
        
        return $errorMessages[$errorCode] ?? 'Error desconocido en la subida';
    }
    
    /**
     * Procesa la subida de un avatar para un usuario
     * 
     * @param User $user El usuario al que se le asignará el avatar
     * @param Request $request La solicitud que contiene el archivo avatar
     * @return array|null [success, message] o null si no hay archivo
     */
    private function processAvatarUpload(User $user, Request $request)
    {
        if (!$request->hasFile('avatar')) {
            return null;
        }
        
        try {
            // Verificar si hay un error en la subida
            $avatar = $request->file('avatar');
            if ($avatar->getError() !== UPLOAD_ERR_OK) {
                $errorMessage = $this->getUploadErrorMessage($avatar->getError());
                \Illuminate\Support\Facades\Log::error('Error al subir avatar: ' . $errorMessage);
                return [false, $errorMessage];
            }
            
            // Agregar opciones para optimizar el archivo original
            $media = $user->addMediaFromRequest('avatar')
                ->withResponsiveImages() // Generar imágenes responsivas automáticamente
                ->sanitizingFileName(function($fileName) {
                    return strtolower(str_replace(['#', '/', '\\', ' '], '-', $fileName));
                })
                ->toMediaCollection('avatar');
            
            // Actualizar el campo avatar_url con la URL de la versión principal
            $user->avatar_url = $media->getUrl('main');
            $user->save();
            
            return [true, null];
            
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
            \Illuminate\Support\Facades\Log::error('Error al procesar avatar: ' . $errorMessage);
            return [false, $errorMessage];
        }
    }
}
