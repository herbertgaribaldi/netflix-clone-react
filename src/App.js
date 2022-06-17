import React, { useEffect, useState } from "react";
import Tmdb from './tmdb';
import MovieRow from './components/MovieRow';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      //pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);
      
      //pegando o FEATURED
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito com muito carinho por Herbert "fishbones" Garibaldi<br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos em <a href={`https://www.themoviedb.org/`} className='footer-link'>The Movie Database (TMDB)</a>
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://hips.hearstapps.com/pop.h-cdn.co/assets/16/48/1600x800/landscape-1480516731-4f155204-7266-486d-88a5-2018ff11f947.gif?resize=480:*" alt="Carregando" />
        </div>
      }
    </div>
  );
}