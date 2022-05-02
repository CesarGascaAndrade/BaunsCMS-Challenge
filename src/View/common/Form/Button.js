import {
    Button
} from 'react-bootstrap';

const ButtonPrimary = (props) => {
    return (
        <Button {...props} style={{
            height: '3.5vw',
            maxHeight: '65px',
            fontSize: '1.15vw !important',
            borderRadius: 30
        }} onClick={props.onClick}>
            {props.children}
        </Button>
    );
}

export default ButtonPrimary;