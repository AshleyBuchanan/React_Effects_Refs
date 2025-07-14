import '../css/Button.css'

const Button = ({label, action, disabled, isActive, reset }) => {
    let classList = disabled === true ? 'disabled' : '';                        //<-- button disabling 
    
    if(isActive===true) classList = 'active';                                   //<-- this is an override for Auto Draw (for visual purposes)
    if(reset===true) classList = ''                                             //<-- this is an override for resetting using the shuffle deck button at card exhaustion
    
    return (
        <div className={`button ${classList}`} onClick={action}>{label}</div>
    )
}

export default Button;