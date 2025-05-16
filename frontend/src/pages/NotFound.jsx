import NavBar from "../components/NavBar";

function NotFound() {
  return (
    // TODO: Style not found page.
    <>
      <NavBar page="notfound" />
      <div>
        <h1>404 Not Found</h1>
        <p>
          The page you're looking for doesn't exist or you are not authorized.
        </p>
      </div>
    </>
  );
}

export default NotFound;
