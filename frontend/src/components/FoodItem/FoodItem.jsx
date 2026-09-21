import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { StoreContext } from '../context/StoreContext';

const FoodItem = ({ _id, id, name, price, description, image, category }) => {
  const itemId = id || _id;
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <article className="food-item">
      <div className="food-item-img-container">
        <img src={`${url}/images/${image}`} className="food-item-image" alt={name} />

        {!cartItems[itemId] ? (
          <button className="add" onClick={() => addToCart(itemId)}>Add to Cart</button>
        ) : (
          <div className="food-item-counter">
            <button onClick={() => removeFromCart(itemId)} aria-label={`Remove one ${name}`}>−</button>
            <span>{cartItems[itemId]}</span>
            <button onClick={() => addToCart(itemId)} aria-label={`Add one ${name}`}>+</button>
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <span className="food-category">{category}</span>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${Number(price).toFixed(2)}</p>
        <button className="details-button" onClick={() => setDetailsOpen(true)}>View details</button>
      </div>
      {detailsOpen && <div className="food-dialog-backdrop" role="presentation" onClick={() => setDetailsOpen(false)}><section className="food-dialog" role="dialog" aria-modal="true" aria-labelledby={`food-title-${itemId}`} onClick={(event) => event.stopPropagation()}><button className="dialog-close" onClick={() => setDetailsOpen(false)} aria-label="Close food details">×</button><img src={`${url}/images/${image}`} alt={name} /><div><p className="food-category">{category}</p><h2 id={`food-title-${itemId}`}>{name}</h2><p>{description}</p><strong>${Number(price).toFixed(2)}</strong>{!cartItems[itemId] ? <button className="dialog-add" onClick={() => addToCart(itemId)}>Add to Cart</button> : <div className="dialog-quantity"><button onClick={() => removeFromCart(itemId)} aria-label={`Remove one ${name}`}>−</button><span>{cartItems[itemId]}</span><button onClick={() => addToCart(itemId)} aria-label={`Add one ${name}`}>+</button></div>}</div></section></div>}
    </article>
  );
};

export default FoodItem;
