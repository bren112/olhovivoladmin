import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import './Adm.css'; // Importando o arquivo CSS de estilos

function Adm() {
  const [noticias, setNoticias] = useState([]);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoResumo, setNovoResumo] = useState('');
  const [novoTexto, setNovoTexto] = useState('');
  const [novaImagem, setNovaImagem] = useState(null);
  const [novoEstilo, setNovoEstilo] = useState('Esporte');

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

  const handleSubmitNoticia = async (event) => {
    event.preventDefault();
    try {
      let publicUrl = '';

      // Verifica se uma nova imagem foi selecionada para upload
      if (novaImagem) {
        // Realiza o upload da imagem para o bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('imagens')
          .upload(`noticias/${novoTitulo}.png`, novaImagem, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Obtém a URL pública da imagem após o upload
        const { data } = supabase
          .storage
          .from('imagens')
          .getPublicUrl(`noticias/${novoTitulo}.png`);
        publicUrl = data.publicUrl;
      }

      // Inserindo notícia no banco de dados
      const { data, error } = await supabase.from('noticias').insert([
        {
          titulo: novoTitulo,
          resumo: novoResumo,
          texto: novoTexto,
          imagem: publicUrl, // Usa a URL pública da imagem
          estilo: novoEstilo,
          data_publicacao: new Date().toISOString(),
        },
      ]);

      if (error) {
        throw error;
      }
      
      console.log('Notícia inserida com sucesso:', data);
      setNovoTitulo('');
      setNovoResumo('');
      setNovoTexto('');
      setNovaImagem(null);
      setNovoEstilo('Esporte');
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
        <form onSubmit={handleSubmitNoticia}>
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
            type="file"
            accept="image/*"
            onChange={(e) => setNovaImagem(e.target.files[0])}
            required
          />
          <br />
          <select
            value={novoEstilo}
            onChange={(e) => setNovoEstilo(e.target.value)}
            required
          >
            <option value="Esporte">Esporte</option>
            <option value="Noticia">Notícia</option>
          </select>
          <br />
          <br />
          <button type="submit">Enviar Notícia</button>
        </form>
      </div>

      <h3>Notícias Cadastradas</h3>
      <br />
      <ul className="news-list">
        {noticias.map((noticia) => (
          <li key={noticia.id}>
            <h4>{noticia.titulo}</h4>
            <img src={noticia.imagem} alt={noticia.titulo} style={{ width: '100px', height: 'auto' }} />
            <button onClick={() => handleExcluirNoticia(noticia.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Adm;
