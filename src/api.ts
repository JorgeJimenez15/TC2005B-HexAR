import axios from "axios";

export const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

export type Credentials = {
	email: string;
	token: string;
};

type ResponseLogin =
	| {
			empleado: {
				correo_empleado: string;
			};
			token: string;
	  }
	| undefined;

export async function login(email: string, password: string): Promise<Credentials | undefined> {
	const { data } = await instance.post<ResponseLogin>("/login", {
		correo_empleado: email,
		password_empleado: password,
	});

	if (!data?.token) return undefined;
	return {
		email: data.empleado.correo_empleado,
		token: data.token,
	};
}

export type User = {
	name: string;
	email: string;
	phone: string;
};

type ResponseGetUser = {
	correo_empleado: string;
	nombre_empleado: string;
	telefono_empleado: string;
};

export async function getUser(email: string, token: string): Promise<User> {
	const { data } = await instance.get<ResponseGetUser>(`/empleado/${email}/${token}`);

	return {
		name: data.nombre_empleado,
		email: data.correo_empleado,
		phone: data.telefono_empleado,
	};
}

export type Project = {
	id: number;
	name: string;
	creation: Date;
};

type ResponseGetProject = {
	id_proyecto: number;
	fecha_de_creacion: string;
	nombre_proyecto: string;
};

export async function getProjects(email: string, token: string): Promise<Project[]> {
	const { data } = await instance.get<ResponseGetProject[]>(`/proyecto/empleado/${email}/${token}`);
	const projects: Project[] = [];

	for (let index = 0; index < data.length; index++) {
		const project = data[index];

		projects.push({
			id: project.id_proyecto,
			name: project.nombre_proyecto,
			creation: new Date(project.fecha_de_creacion),
		});
	}

	return projects;
}

export async function createProject(name: string, email: string, token: string): Promise<void> {
	await instance.post(`/proyecto/${token}`, {
		nombre_proyecto: name,
		correo_creador: email,
		correo_cliente: "sergio@gmail.com",
	});
}

export async function deleteProject(id: number, token: string): Promise<void> {
	await instance.delete(`/proyecto/${id}/${token}`);
}

type ResponseGetModel = {
	id_modelo: number;
	nombre_modelo: string;
	archivo_modelo: string;
	fecha_de_creacion: string;
};

export type Model = {
	id: number;
	name: string;
	source: string;
	creation: Date;
};

export async function getModels(): Promise<Model[]> {
	const { data } = await instance.get<ResponseGetModel[]>("/modelo");
	const models: Model[] = [];

	for (let index = 0; index < data.length; index++) {
		const model = data[index];

		models.push({
			id: model.id_modelo,
			name: model.nombre_modelo,
			source: model.archivo_modelo,
			creation: new Date(model.fecha_de_creacion),
		});
	}

	return models;
}

export async function createModel(name: string, token: string, file: File): Promise<void> {
	const formData = new FormData();
	formData.append("file", file, `model_${Math.floor(Math.random() * 100)}`);

	await instance.post(`/proyecto/20/archivo/${name}/${token}`, formData);
}

export async function deleteModel(id: number, token: string): Promise<void> {
	await instance.delete(`/modelo/${id}/${token}`);
}

// * Probably will never use (xd)
// export async function getModel(file: string): Promise<void> {
// 	const {} = await instance.get(`/files/${file}`);
// }
