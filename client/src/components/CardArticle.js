import React, {useState} from "react";
import '../Styles/CardArticleStyles.css'

export const CardArticle = ({ id, theme, image, createdAt, author }) => {

    const [date, setDate] = useState(new Date(createdAt))

    return (
        <div className="cardArticle">
            <img className="imageInCard" src={image}  alt={"Image is loading ... "} />
            <h1 className="nameArticle">{theme}</h1>
            <h4 className="authroInform">{`Added: by${date.toLocaleString()} ${author.name}`}</h4>
        </div>
    )
}
