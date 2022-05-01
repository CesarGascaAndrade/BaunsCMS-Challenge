import {
    useParams,
    useNavigate,
    useSearchParams
} from "react-router-dom";

export default (Component) => {
    return props => (
        <Component
            {...props}
            navigate={useNavigate()}
            params={useParams()}
            searchParams={useSearchParams()} />
    );
}
