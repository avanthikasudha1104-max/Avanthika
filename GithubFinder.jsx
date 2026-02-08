import { useState } from "react";
import "../GithubFinder.css";

function GithubFinder() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const searchUser = async () => {
    if (!username) return;

    setLoading(true);
    setUser(null);

    try {
      const res = await fetch(`https://api.github.com/users/${username}`);

      if (res.status === 404) {
        alert("User not found ");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setUser(data);

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (err) {
      alert("Something went wrong ");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchUser();
  };

  const clearSearch = () => {
    setUsername("");
    setUser(null);
    setRepos([]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="container">
      <h1 className="title">GitHub Finder</h1>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button className="btn search" onClick={searchUser}>
          Search
        </button>

        <button className="btn clear" onClick={clearSearch}>
          Clear
        </button>

        <button className="btn dark" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {loading && <p className="loading">Loading... ⏳</p>}

      {/* Result Section */}
      <div className="result-wrapper">
        {user && (
          <div className="card profile">
            <img src={user.avatar_url} alt="avatar" />
            <h3>{user.name}</h3>
            <p>{user.bio}</p>
            <p>Followers: {user.followers}</p>
            <p>Public Repos: {user.public_repos}</p>

            <a href={user.html_url} target="_blank" rel="noreferrer">
              View Profile
            </a>
          </div>
        )}

        {repos.length > 0 && (
          <div className="card repos">
            <h3>Repositories (Top 10 by Stars)</h3>

            <ul>
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 10)
                .map((repo) => (
                  <li key={repo.id}>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {repo.name} ⭐ {repo.stargazers_count}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default GithubFinder;
