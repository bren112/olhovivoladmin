import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import './Adm.css'; // Importando o arquivo CSS de estilos

function Adm() {
  const [noticias, setNoticias] = useState([]);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoResumo, setNovoResumo] = useState('');
  const [novoTexto, setNovoTexto] = useState('');
  const [novoImagem, setNovoImagem] = useState('');
  const [novoEstilo, setNovoEstilo] = useState('');

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const { data, error } = await supabase.from('noticias').select('*');
      if (error) {
        throw error;
      }
      setNoticias(data);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.from('noticias').insert([
        {
          titulo: novoTitulo,
          resumo: novoResumo,
          texto: novoTexto,
          imagem: novoImagem,
          estilo: novoEstilo,
          data_publicacao: new Date().toISOString(),
        },
      ]);
      if (error) {
        throw error;
      }
      console.log('Notícia inserida com sucesso:', data);
      // Limpa os campos do formulário após submissão
      setNovoTitulo('');
      setNovoResumo('');
      setNovoTexto('');
      setNovoImagem('');
      setNovoEstilo('');
      // Atualiza a lista de notícias após inserção
      fetchNoticias();
    } catch (error) {
      console.error('Erro ao inserir notícia:', error.message);
    }
  };

  const handleExcluirNoticia = async (id) => {
    if (window.confirm('Tem certeza que quer excluir esta notícia?')) {
      try {
        const { data, error } = await supabase.from('noticias').delete().eq('id', id);
        if (error) {
          throw error;
        }
        console.log('Notícia excluída com sucesso:', data);
        // Atualiza a lista de notícias após exclusão
        fetchNoticias();
      } catch (error) {
        console.error('Erro ao excluir notícia:', error.message);
      }
    }
  };

  return (
    <div className="admin-container">
      <h2>Área Administrativa</h2>
<br />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h3>Inserir Nova Notícia</h3>
<br />

          <input
            type="text"
            placeholder="Título"
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
            required
          />
          <br />
          <textarea
            placeholder="Resumo"
            value={novoResumo}
            onChange={(e) => setNovoResumo(e.target.value)}
            required
          />
          <br />
          <textarea
            placeholder="Texto Completo"
            value={novoTexto}
            onChange={(e) => setNovoTexto(e.target.value)}
            required
          />
          <br />
          <input
            type="url"
            placeholder="URL da Imagem"
            value={novoImagem}
            onChange={(e) => setNovoImagem(e.target.value)}
            required
          />
          <br />
          <input
            type="text"
            placeholder="Estilo"
            value={novoEstilo}
            onChange={(e) => setNovoEstilo(e.target.value)}
            required
          />
          <br />
          <button type="submit">Enviar Notícia</button>
        </form>
      </div>

      <h3>Notícias Cadastradas</h3>
<br />

      <ul className="news-list">
        {noticias.map((noticia) => (
          <li key={noticia.id}>
            {noticia.titulo}{' '}
            <button onClick={() => handleExcluirNoticia(noticia.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Adm;
