
declare interface corsOptionsType {
	static origin: (string | any)[];

	static methods: (string | any)[];

	static allowedHeaders: (string | any)[];

	static credentials: any;

	static maxAge: any;
}
