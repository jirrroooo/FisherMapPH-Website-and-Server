import "./style.css";

export default function Signup(){
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
      }, []);
    
    return(
        <div className="space-y-4 font-medium text-center text-4xl">
            Sign Up
        </div>
    );
}