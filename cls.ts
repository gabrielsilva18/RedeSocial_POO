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

  constructor(
    id: number,
    texto: string,
    curtidas: number,
    descurtidas: number,
    data: string,
    perfil: Perfil
  ) {
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
    return this._curtidas > this._descurtidas * 1.5;
  }
}

export class PostagemAvancada extends Postagem {
  private _hashtags: string[];
  private _visualizacoesRestantes: number;

  constructor(
    id: number,
    texto: string,
    curtidas: number,
    descurtidas: number,
    data: string,
    perfil: Perfil,
    hashtags: string[],
    visualizacoesRestantes: number
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
    if (!this._postagens.some((post) => post.id === postagem.id)) {
      this._postagens.push(postagem);
    }
  }

  consultar(id: number, hashtag: string): Postagem[] {
    const posts: Postagem[] = [];

    for (let i = 0; i < this._postagens.length; i++) {
      const currentPost: Postagem = this._postagens[i];

      if (
        currentPost instanceof Postagem &&
        !(currentPost instanceof PostagemAvancada)
      ) {
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

  constructor(
    repPerfis: RepositorioDePerfis,
    repPosts: RepositorioDePostagens
  ) {
    this._repPerfis = repPerfis;
    this._repPosts = repPosts;
  }

  public getPostagens(): RepositorioDePostagens {
    return this._repPosts;
  }

  incluirPerfilRede(perfil: Perfil): void {
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
    if (
      !postagem.id ||
      !postagem.texto ||
      !postagem.curtidas ||
      !postagem.descurtidas ||
      !postagem.data ||
      !postagem.perfil
    ) {
      return;
    }
    if (!this._repPosts.postagens.some((post) => post.id === postagem.id)) {
      this._repPosts.incluir(postagem);
    }
  }

  // iv. Método para consultar postagens, cuidado que as postagens podem ter n parâmetros iguais, se tiverem 1 deles diferentes, são postagens diferentes.
  consultarPostagens(
    id: number,
    texto: string,
    hashtag: string,
    perfil: Perfil
  ): Postagem[] {
    return this._repPosts.postagens.filter((postagem) => {
      if (id && postagem.perfil.id !== id) {
        return false;
      }
      if (texto && !postagem.texto.includes(texto)) {
        return false;
      }
      if (
        hashtag &&
        postagem instanceof PostagemAvancada &&
        !postagem.hashtags.includes(hashtag)
      ) {
        return false;
      }
      if (perfil && postagem.perfil !== perfil) {
        return false;
      }
      return true;
    });
  }

  // v. Método para curtir uma postagem
  curtirPostagem(idPostagem: number): void {
    const postagem = this._repPosts.postagens.find(
      (post) => post.id === idPostagem
    );
    if (postagem) {
      postagem.curtir();
    }
  }

  // vi. Método para descurtir uma postagem
  descurtirPostagem(idPostagem: number): void {
    const postagem = this._repPosts.postagens.find(
      (post) => post.id === idPostagem
    );
    if (postagem) {
      postagem.descurtir();
    }
  }

  // vii. Método para decrementar visualizações de postagem avançada, as postagens não podem ter visualizações negativas
  decrementarVisualizacoesPostagem(postagem: PostagemAvancada): void {
    if (postagem.visualizacoesRestantes > 0) {
      postagem.decrementarVisualizacoes();
    }
  }

  // viii. Método para exibir postagens por perfil, lembrar de ver se a postagem possui visualizações restantes e se possuir, após a consulta decrementar 1 dessas visualizações
  exibirPostagensPorPerfilPostagem(id: number): Postagem[] {
    const postagensDoPerfil = this._repPosts.postagens.filter(
      (postagem) => postagem.perfil.id === id
    );
    const postagensExibiveis = postagensDoPerfil.filter((postagem) => {
      if (postagem instanceof PostagemAvancada) {
        return postagem.visualizacoesRestantes > 0;
      }
      return true;
    });
    postagensExibiveis.forEach((postagem) => {
      if (postagem instanceof PostagemAvancada) {
        this.decrementarVisualizacoesPostagem(postagem);
      }
    });
    return postagensExibiveis;
  }

  // ix. Método para exibir postagens por hashtags

  exibirPostagensPorHashtagPostagem(hashtag: string): PostagemAvancada[] {
    const postagensComHashtag = this._repPosts.postagens.filter((postagem) => {
      return (
        postagem instanceof PostagemAvancada &&
        postagem.hashtags.includes(hashtag)
      ); //verifico se é uma instancia de postagem avançada para assim ver a hashtag e depois verifico se a hashtag e igual ao parametro
    });

    //A partir daqui verifico se a postagem possui visualizações restantes e decremento essaas visualizações!
    const postagensExibiveis = postagensComHashtag.filter((postagem) => {
      if (postagem instanceof PostagemAvancada) {
        return postagem.visualizacoesRestantes > 0;
      }
      return true;
    });

    postagensExibiveis.forEach((postagem) => {
      if (postagem instanceof PostagemAvancada) {
        this.decrementarVisualizacoesPostagem(postagem);
      }
    });

    return postagensExibiveis as PostagemAvancada[];
  }
}

export class App {
  private _redeSocial: RedeSocial;

  constructor(_redeSocial: RedeSocial) {
    this._redeSocial = _redeSocial;
  }

  get redesSociais(): RedeSocial {
    return this._redeSocial;
  }

  exibirMenu(): void {
    let opcao: string;

    do {
      console.log("=== Menu da Rede Social ===");
      console.log("1. Incluir Perfil");
      console.log("2. Consultar Perfil");
      console.log("3. Incluir Postagem");
      console.log("4. Consultar Postagens");
      console.log("5. Curtir Postagem");
      console.log("6. Descurtir Postagem");
      console.log("7. Decrementar Visualizações");
      console.log("8. Exibir Postagens por Perfil");
      console.log("9. Exibir Postagens por Hashtag");
      console.log("0. Sair");

      opcao = prompt("Digite a opção desejada: ");

      switch (opcao) {
        case "1":
          this.incluirPerfilApp();
          break;
        case "2":
          this.consultarPerfilApp(id,nome,email);
          break;
        case "3":
          this.incluirPostagemApp();
          break;
        case "4":
          this.consultarPostagensApp();
          break;
        case "5":
          this.curtirPostagemApp();
          break;
        case "6":
          this.descurtirPostagemApp();
          break;
        case "7":
          this.decrementarVisualizacoesApp();
          break;
        case "8":
          this.exibirPostagensPorPerfilApp();
          break;
        case "9":
          this.exibirPostagensPorHashtagApp();
          break;
        case "0":
          console.log("Saindo do programa.");
          break;
        default:
          console.log("Opção inválida. Tente novamente.");
      }
    } while (opcao !== "0");
  }

  incluirPerfilApp(perfil: Perfil): void {
    this.redesSociais.incluirPerfilRede(perfil);
  }

  consultarPerfilApp(id: number, nome: string, email: string): Perfil | null {
    return this._redeSocial.consultarPerfil(id, nome, email);
  }

  incluirPostagemApp(postagem: Postagem): void {
    this._redeSocial.incluirPostagem(postagem);
  }

  consultarPostagensApp(
    id: number,
    texto: string,
    hashtag: string,
    perfil: Perfil
  ): Postagem[] {
    return this._redeSocial.consultarPostagens(id, texto, hashtag, perfil);
  }

  curtirPostagemApp(idPostagem: number): void {
    this._redeSocial.curtirPostagem(idPostagem);
  }

  descurtirPostagemApp(idPostagem): void {
    this._redeSocial.descurtirPostagem(idPostagem);
  }

  decrementarVisualizacoesApp(Postagem: PostagemAvancada): void {
    this._redeSocial.decrementarVisualizacoesPostagem(Postagem);
  }

  exibirPostagensPorPerfilApp(id: number): Postagem[] {
    return this._redeSocial.exibirPostagensPorPerfilPostagem(id);
  }

  exibirPostagensPorHashtagApp(hashtag: string): Postagem[] {
    return this._redeSocial.exibirPostagensPorHashtagPostagem(hashtag);
  }
}
