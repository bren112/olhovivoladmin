import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';

function CriarNoticia() {
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [texto, setTexto] = useState('');
  const [imagem, setImagem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setImagem(event.target.files[0]);
  };

  const handleUploadNoticia = async (event) => {
    event.preventDefault();

    if (!imagem) {
      setMessage('Por favor, selecione uma imagem para upload.');
      return;
    }

    setUploading(true);

    try {
      // Fazendo upload da imagem para o bucket
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('imagens')
        .upload(`noticias/${imagem.name}`, imagem, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtendo a URL pública da imagem
      const { data: publicData } = supabase
        .storage
        .from('imagens')
        .getPublicUrl(`noticias/${imagem.name}`);
      
      const imageUrl = publicData.publicUrl;

      // Inserindo a notícia com a URL da imagem no banco de dados
      const { data, error } = await supabase.from('noticias').insert([
        {
          titulo,
          resumo,
          texto,
          imagem: imageUrl,
          data_publicacao: new Date().toISOString(),
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage('Notícia criada com sucesso!');
      setTitulo('');
      setResumo('');
      setTexto('');
      setImagem(null);
    } catch (error) {
      setMessage('Erro ao criar notícia: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Criar Nova Notícia</h1>
      <form onSubmit={handleUploadNoticia}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Resumo"
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Texto Completo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required
        />
        <br />
        <input type="file" onChange={handleFileChange} required />
        <br />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Fazendo upload...' : 'Criar Notícia'}
        </button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default CriarNoticia;
