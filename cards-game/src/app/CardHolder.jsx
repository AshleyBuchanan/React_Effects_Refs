import '../css/CardHolder.css'

const CardHolder = ({children}) => {
    return (
        <div className="cardHolder">
            {children}
        </div>
    )
}

export default CardHolder;