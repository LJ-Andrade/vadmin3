import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AiQueryService } from '@src/app/services/ai-query.service'
import { Button } from 'primeng/button';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	imports: [ FormsModule, CommonModule, Button ],
})

export class ChatComponent {

	prompt = '';
	rawResponse = '';
	results: any[] = [];
	token = 'TU_TOKEN_AQUI';

	
	constructor(private aiService: AiQueryService) { }

	submitQuery() {
		this.aiService.runQuery(this.prompt, this.token).subscribe({
			next: (res: any) => {
				console.log('Respuesta IA:', res);
				if (res.response) {
					// Es una respuesta natural
					this.rawResponse = res.response;
					console.log('Respuesta IA:', res.response);
				} else if (Array.isArray(res)) {
					// Es un array de resultados
					this.results = res;
				} else {
					// Fallback por si viene algo raro
					this.rawResponse = JSON.stringify(res);
				}
			},
			error: (err) => {
				console.error('Error:', err);
				this.rawResponse = 'Hubo un error al contactar a la IA.';
			},
		});
		
	}

	submitRawChat() {
		this.aiService.runRawChat(this.prompt).subscribe({
		  next: (res) => {
			console.log('Respuesta IA:', res);
			this.rawResponse = res.response;
		  },
		  error: (err) => {
			console.error('Error:', err);
			this.rawResponse = 'Hubo un error al contactar a la IA.';
		  },
		});
	  }
}
