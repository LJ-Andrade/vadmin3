import { ValidatorFn } from "@angular/forms";

export interface ListData {
	name: string;
	text: string;
	unDeleteableIds?: number[];
	unEditableIds?: number[];

	valueClass?: string;
	image?: boolean;
	mutate?: (data: any) => string;
	hidden?: boolean;
	hideOnList?: boolean;
	hideOnCreation?: boolean;
	hideOnEdition?: boolean;
	columnClass?: string;
	/**
	 * Show the value as a badge
	 * Possible values: true, false
	*/
	showAsBadge?: boolean;
	
	/**
	 * Background color class for badges
	 * Possible values: bg-yellow-50, bg-red-50, bg-green-50, bg-blue-50, bg-purple-50, bg-pink-50
	*/
	badgeBgClass?: string;
	isRelation?: boolean;
	isArray?: boolean;
	relationName?: any;
	relationDisplayName?: any;
	relationValue?: any;
	

	search?: {
		placeholder: string;
		type?: string;
		options?: FormFieldOptionConfig
	}
}


export type FormFieldType = 'text' | 'select' | 'number' | 'checkbox' | 'textarea' | 'file' | 'image';
export interface FormFieldOptionConfig {
    /**
     * The name of the field to be used as identifier
     */
    name?: string;

    /**
     * The field to be displayed in the UI
     */
    displayField?: string;

    /**
     * The name of the value field to be used when submitting forms
     */
    valueName?: string;

    /**
     * Array of items to be used in select/dropdown fields if data is not fetched from the backend (relations)
     */
    items?: any[];
}


export const AspectRatios = {
    FREE: 0,
    SQUARE: 1,
    RATIO_16_9: 16 / 9,
    RATIO_4_3: 4 / 3,
    RATIO_3_4: 3 / 4,
    RATIO_9_16: 9 / 16,
    RATIO_21_9: 21 / 9,
    RATIO_4_5: 4 / 5
}

export interface FormField {
	type: FormFieldType;
	name: string;
	label?: string;
	value?: any;
	placeholder?: string;
	class?: string;
	hidden?: boolean;
	isRelation?: boolean;
	options?: FormFieldOptionConfig;
	matchTo?: string;
	validators?: ValidatorFn[];
	fileProperties?: {
		accept?: string;
		maxSize?: number;
	},
	imageProperties?: {
		accept?: string;
		maxSize?: number;
		useCropper?: boolean;
		maintainAspectRatio?: boolean;
		aspectRatio?: number;
		resizeToWidth?: number;
	}
}


export interface ListConfig {
	unDeleteableIds: number[];
	unEditableIds: number[];
}

export type FormSize = 'SMALL' | 'MEDIUM' | 'LARGE'

export interface SectionConfig {
	/**
	 * The name of the model in the backend and its crucial for the CRUD operations
	 */
	model: string
	/**
	 * The icon to use for the section
	 */
	icon: string
	/**
	 * The name of the model in singular form
	 */
	nameSingular: string
	/**
	 * The name of the model in plural form
	 */
	namePlural: string
	/**
	 * The size of the form
	 */
	formSize: FormSize
}