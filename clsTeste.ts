// Importe as classes do seu código
import { Perfil, Postagem, PostagemAvancada, RepositorioDePerfis, RepositorioDePostagens, RedeSocial } from './cls';

// Crie instâncias de RepositorioDePerfis e RepositorioDePostagens
const repPerfis = new RepositorioDePerfis();
const repPosts = new RepositorioDePostagens();

// Crie uma instância de RedeSocial
const redeSocial = new RedeSocial(repPerfis, repPosts);

// Crie alguns perfis
const perfil1 = new Perfil(1, 'Alice', 'alice@email.com');
const perfil2 = new Perfil(2, 'Bob', 'bob@email.com');

// Adicione os perfis ao RepositorioDePerfis
repPerfis.incluir(perfil1);
repPerfis.incluir(perfil2);

// Crie algumas postagens
const postagem1 = new Postagem(1, 'Postagem de Alice', 10, 5, '2023-01-01', perfil1);
const postagem2 = new Postagem(2, 'Postagem de Bob', 15, 8, '2023-01-02', perfil2);
const postagemAvancada1 = new PostagemAvancada(3, 'Postagem Avançada de Alice', 20, 10, '2023-01-03', perfil1, ['#tag1', '#tag2'], 100);

// Adicione as postagens ao RepositorioDePostagens
repPosts.incluir(postagem1);
repPosts.incluir(postagem2);
repPosts.incluir(postagemAvancada1);

// Teste as operações da RedeSocial
console.log('Teste incluirPerfil:');
redeSocial.incluirPerfil(perfil1);
redeSocial.incluirPerfil(perfil2);

console.log('Teste consultarPerfil:');
console.log(redeSocial.consultarPerfil(1, '', '')); // Deve retornar o perfil1
console.log(redeSocial.consultarPerfil(2, '', '')); // Deve retornar o perfil2
console.log(redeSocial.consultarPerfil(3, '', '')); // Deve retornar null

console.log('Teste incluirPostagem:');
const novaPostagem = new Postagem(4, 'Nova postagem de Alice', 5, 2, '2023-01-04', perfil1);
redeSocial.incluirPostagem(novaPostagem);
console.log(redeSocial.getPostagens().postagens);

console.log('Teste consultarPostagens:');
console.log(redeSocial.getPostagens().consultar(1, '')); // Deve retornar postagem1 e postagemAvancada1
console.log(redeSocial.getPostagens().consultar(2, '')); // Deve retornar postagem2

// Teste incluir perfil e postagem na RedeSocial
console.log('Teste incluirPerfil e incluirPostagem na RedeSocial:');
const novoPerfil = new Perfil(3, 'Charlie', 'charlie@email.com');
const novaPostagem2 = new Postagem(5, 'Nova postagem de Charlie', 5, 2, '2023-01-04', novoPerfil);
redeSocial.incluirPerfil(novoPerfil);
redeSocial.incluirPostagem(novaPostagem2);
console.log(redeSocial.getPostagens().postagens); // Deve incluir a nova postagem
console.log(redeSocial.consultarPerfil(3, '', '')); // Deve retornar o novo perfil

// Teste consultar postagens na RedeSocial
console.log('Teste consultarPostagens na RedeSocial:');
console.log(redeSocial.getPostagens().consultar(1, '')); // Deve retornar postagem1, postagemAvancada1 e novaPostagem
console.log(redeSocial.getPostagens().consultar(2, '')); // Deve retornar postagem2
