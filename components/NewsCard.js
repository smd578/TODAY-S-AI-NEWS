
import React from 'react';

const NewsCard = ({ article }) => {
  return (
    <div className="card mb-3">
      {article.urlToImage && <img src={article.urlToImage} className="card-img-top" alt={article.title} />}
      <div className="card-body">
        <h5 className="card-title">{article.title}</h5>
        <p className="card-text">{article.description}</p>
        <p className="card-text">
          <small className="text-muted">{article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}</small>
        </p>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read More</a>
      </div>
    </div>
  );
};

export default NewsCard;
