export class Perfil {
    private _id: number;
    private _nome: string;
    private _email: string;
    
    constructor(id: number, nome: string, email: string) {
        this._id = id;
        this._nome = nome;
        this._email = email;
    }

    get id(): number {
        return this._id;
    }

    get nome(): string {
        return this._nome;
    }

    get email(): string {
        return this._email;
    }
}

export class Postagem {
    private _id: number;
    private _texto: string;
    private _curtidas: number;
    private _descurtidas: number;
    private _data: string;
    private _perfil: Perfil;

    constructor(id: number, texto: string, curtidas: number, descurtidas: number, data: string, perfil: Perfil) {
        this._id = id;
        this._texto = texto;
        this._curtidas = curtidas;
        this._descurtidas = descurtidas;
        this._data = data;
        this._perfil = perfil;
    } 

    get id(): number {
        return this._id;
    }

    get texto(): string {
        return this._texto;
    }

    get curtidas(): number {
        return this._curtidas;
    }

    set curtidas(newValue: number) {
        this._curtidas = newValue;
    }

    get descurtidas(): number {
        return this._descurtidas;
    }

    set descurtidas(newValue: number) {
        this._descurtidas = newValue;
    }

    get data(): string {
        return this._data;
    }

    get perfil(): Perfil {
        return this._perfil;
    }

    curtir(): void {
        this._curtidas += 1;
    }

    descurtir(): void {
        this._descurtidas += 1;
    }

    ehPopular(): boolean {
       return this._curtidas > (this._descurtidas * 1.5);
    }
}

export class PostagemAvancada extends Postagem {
    private _hashtags: string[];
    private _visualizacoesRestantes: number;
    
    constructor(
        id: number, texto: string, curtidas: number, descurtidas: number, data: string, perfil: Perfil,
        hashtags: string[], visualizacoesRestantes: number
        ) {
        super(id, texto, curtidas, descurtidas, data, perfil);
        this._hashtags = hashtags;
        this._visualizacoesRestantes = visualizacoesRestantes;
    }

    get hashtags(): string[] {
        return this._hashtags;
    }

    get visualizacoesRestantes(): number {
        return this._visualizacoesRestantes;
    }

    set visualizacoesRestantes(newValue: number) {
        this._visualizacoesRestantes = newValue;
    }

    adicionarHashtag(hashtag: string): void {
        if (!this.existeHashtag(hashtag)) {
            this._hashtags.push(hashtag);
        }
    }

    existeHashtag(hashtag: string): boolean {
        return this._hashtags.indexOf(hashtag) !== -1;
    }

    decrementarVisualizacoes(): void {
        this._visualizacoesRestantes--;
    }
}

export class RepositorioDePerfis {
    private _perfis: Perfil[];
    
    constructor() {
        this._perfis = [];
    }

    get perfis(): Perfil[] {
        return this._perfis;
    }

    incluir(perfil: Perfil): void {
        this._perfis.push(perfil);
    }
    
    consultar(id: number): Perfil | null {
        for (let i = 0; i < this._perfis.length; i++) {
            if (id === this._perfis[i].id) {
                return this._perfis[i];
            }
        }
        return null;
    }
}

export class RepositorioDePostagens {
    private _postagens: Postagem[];
    
    constructor() {
        this._postagens = [];
    }

    get postagens(): Postagem[] {
        return this._postagens;
    }
    
    incluir(postagem: Postagem): void {
        if (!this._postagens.some(post => post.id === postagem.id)) {
            this._postagens.push(postagem);
        }
    }

    consultar(id: number, hashtag: string): Postagem[] {
        const posts: Postagem[] = [];
        
        for(let i = 0; i < this._postagens.length; i++) {
            const currentPost: Postagem = this._postagens[i];
            
            if (currentPost instanceof Postagem && !(currentPost instanceof PostagemAvancada)) {
                const currentPostPersonId: number = currentPost.perfil.id;
                if (id === currentPostPersonId) {
                    posts.push(currentPost);
                }
            }

            if (currentPost instanceof PostagemAvancada) {
                if (currentPost.hashtags.indexOf(hashtag) !== -1) {
                    posts.push(currentPost);
                }
            }
        }
        return posts;
    }
}

export class RedeSocial {
    private _repPerfis: RepositorioDePerfis;
    private _repPosts: RepositorioDePostagens;

    constructor(repPerfis: RepositorioDePerfis, repPosts: RepositorioDePostagens) {
        this._repPerfis = repPerfis;
        this._repPosts = repPosts;
    }

    public getPostagens(): RepositorioDePostagens {
        return this._repPosts;
    }
    
    incluirPerfil(perfil: Perfil): void {
        for (let i = 0; i < this._repPerfis.perfis.length; i++) {
            if (perfil.id === this._repPerfis.perfis[i].id) {
                return;
            }
        }
        if (perfil.nome !== undefined && perfil.email) {
            this._repPerfis.incluir(perfil);
        }
    }

    consultarPerfil(id: number, nome: string, email: string): Perfil | null {
        return this._repPerfis.consultar(id);
    }

    incluirPostagem(postagem: Postagem): void {
        if (!postagem.id || !postagem.texto || !postagem.curtidas || !postagem.descurtidas || !postagem.data || !postagem.perfil) {
            return;
        }
        if (!this._repPosts.postagens.some(post => post.id === postagem.id)) {
            this._repPosts.incluir(postagem);
        }
    }

    consultar
}
