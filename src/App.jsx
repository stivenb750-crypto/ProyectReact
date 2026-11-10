import React, { useState, useEffect } from 'react';

export default function App() {
  const [busqueda, setBusqueda] = useState('Avengers'); // Búsqueda inicial por defecto
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalPelicula, setModalPelicula] = useState(null);

  // API Key pública y gratuita de demostración para buscar en todo el catálogo mundial
  const API_KEY = 'c45a857c193f6302f2b5061c3b85e743'; 

  useEffect(() => {
    const buscarPeliculasGlobales = async () => {
      setCargando(true);
      try {
        const query = busqueda.trim() === '' ? 'trending' : busqueda;
        const endpoint = busqueda.trim() === '' 
          ? `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=es-ES`
          : `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`;

        const respuesta = await fetch(endpoint);
        const datos = await respuesta.json();
        
        if (datos.results) {
          setPeliculas(datos.results);
        }
      } catch (error) {
        console.error('Error al conectar con la base de datos de cine:', error);
      } finally {
        setCargando(false);
      }
    };

    const timer = setTimeout(() => {
      buscarPeliculasGlobales();
    }, 400); // Pequeño retraso para que busque fluidamente mientras escribes

    return () => clearTimeout(timer);
  }, [busqueda]);

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        .netflix-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .netflix-card:hover {
          transform: scale(1.07);
          box-shadow: 0 12px 30px rgba(229, 9, 20, 0.6);
          z-index: 10;
        }
      `}</style>

      {/* NAVBAR NETFLIX - BSTOROPELI */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 4%', backgroundColor: '#000', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #222' }}>
        <h1 style={{ color: '#E50914', fontSize: '1.9rem', margin: 0, fontWeight: '900', letterSpacing: '1px' }}>
          BSTOROPELI
        </h1>
        <input 
          type="text" 
          placeholder="🔍 Escribe CUALQUIER película del mundo..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '10px 18px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '20px', width: '300px', outline: 'none', fontSize: '0.95rem' }}
        />
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ padding: '30px 4%' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#e5e5e5' }}>
          {busqueda.trim() === '' ? '🔥 Tendencias Globales' : `Resultados para: "${busqueda}"`}
        </h2>

        {cargando && <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Buscando en la base de datos mundial...</p>}

        {!cargando && peliculas.length === 0 && (
          <p style={{ color: '#888', fontSize: '1.1rem' }}>No se encontró ninguna película con ese nombre en el mundo real. Prueba con otra.</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {peliculas.map((pelicula) => {
            const posterUrl = pelicula.poster_path 
              ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}` 
              : 'https://via.placeholder.com/500x750?text=Sin+Imagen';

            return (
              <div 
                key={pelicula.id}
                className="netflix-card"
                onClick={() => setModalPelicula(pelicula)}
                style={{ backgroundColor: '#1f1f1f', borderRadius: '6px', overflow: 'hidden' }}
              >
                <img src={posterUrl} alt={pelicula.title} style={{ width: '100%', height: '270px', objectFit: 'cover' }} />
                <div style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#46d369', fontWeight: 'bold', marginBottom: '4px' }}>
                    <span>⭐ {pelicula.vote_average ? pelicula.vote_average.toFixed(1) : 'N/A'}</span>
                    <span>{pelicula.release_date ? pelicula.release_date.split('-')[0] : 'S/F'}</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pelicula.title}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DETALLES */}
      {modalPelicula && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#181818', borderRadius: '8px', maxWidth: '600px', width: '100%', overflow: 'hidden', position: 'relative', border: '1px solid #404040' }}>
            <button onClick={() => setModalPelicula(null)} style={{ position: 'absolute', top: '12px', right: '15px', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: '1.5rem', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', zIndex: 10 }}>✕</button>
            
            {modalPelicula.backdrop_path ? (
              <img src={`https://image.tmdb.org/t/p/w780${modalPelicula.backdrop_path}`} alt={modalPelicula.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sin Vista Previa</div>
            )}

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem' }}>{modalPelicula.title}</h2>
                <span style={{ color: '#46d369', fontWeight: 'bold' }}>⭐ {modalPelicula.vote_average ? modalPelicula.vote_average.toFixed(1) : 'N/A'}</span>
              </div>
              <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto' }}>
                {modalPelicula.overview || 'Sin sinopsis disponible en español.'}
              </p>
              <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#777', display: 'flex', justifyContent: 'space-between' }}>
                <span>Idioma original: {modalPelicula.original_language?.toUpperCase()}</span>
                <span>Estreno: {modalPelicula.release_date || 'Desconocido'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}