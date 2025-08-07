
import React from 'react';
import NewsCard from './NewsCard';
import Link from 'next/link';

const NewsSection = ({ title, articles, query }) => {
  if (!articles) {
    return null;
  }

  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{title}</h2>
        <Link href={`/theme/${encodeURIComponent(query)}?title=${encodeURIComponent(title)}`} passHref>
          <button className="btn btn-primary">더보기</button>
        </Link>
      </div>
      <div className="row">
        {articles.slice(0, 8).map((article, index) => (
          <div className="col-lg-3 col-md-6" key={index}>
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
