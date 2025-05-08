import React, { useEffect, useState } from 'react';
import './Roster.css'; // Importing the CSS file for styling the component

function Roster() {
  // State variables to manage the roster data and UI state
  const [positionPlayers, setPositionPlayers] = useState<any[]>([]); // Stores position players' data
  const [pitchers, setPitchers] = useState<any[]>([]); // Stores pitchers' data
  const [loading, setLoading] = useState(true); // Tracks whether the data is still loading
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string; table: string } | null>(null); 
  // Tracks the current sorting configuration (key, direction, and table)

  // useEffect hook to fetch roster data when the component mounts
  useEffect(() => {
    const fetchRoster = async () => {
      try {
        // Fetching the roster data from the MLB API
        const response = await fetch('https://statsapi.mlb.com/api/v1/teams/146/roster');
        if (!response.ok) {
          throw new Error('Failed to fetch roster'); // Throw an error if the response is not OK
        }
        const data = await response.json(); // Parse the JSON response
        const rosterData = data.roster; // Extract the roster array from the response

        // Fetching stats for each player in the roster
        const playerStatsPromises = rosterData.map(async (player: any) => {
          const statsResponse = await fetch(
            `https://statsapi.mlb.com/api/v1/people/${player.person.id}/stats?stats=season`
          );
          const statsData = await statsResponse.json(); // Parse the JSON response for stats
          return {
            name: player.person.fullName, // Player's full name
            position: player.position.abbreviation, // Player's position abbreviation
            stats: statsData.stats[0]?.splits[0]?.stat || {}, // Extract stats or default to an empty object
          };
        });

        // Wait for all player stats to be fetched
        const rosterWithStats = await Promise.all(playerStatsPromises);

        // Separate position players and pitchers based on their position
        setPositionPlayers(rosterWithStats.filter((player) => player.position !== 'P')); // Non-pitchers
        setPitchers(rosterWithStats.filter((player) => player.position === 'P')); // Pitchers
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching roster:', error); // Log any errors
        setLoading(false); // Ensure loading is set to false even if an error occurs
      }
    };

    fetchRoster(); // Call the fetchRoster function when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  // Function to handle sorting of the tables
  const handleSort = (key: string, table: 'positionPlayers' | 'pitchers') => {
    let direction = 'ascending'; // Default sorting direction
    // Toggle the sorting direction if the same column is clicked again
    if (sortConfig && sortConfig.key === key && sortConfig.table === table && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction, table }); // Update the sorting configuration

    // Sort the position players table
    if (table === 'positionPlayers') {
      const sortedPlayers = [...positionPlayers].sort((a, b) => {
        if (a.stats[key] < b.stats[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a.stats[key] > b.stats[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0; // If values are equal, maintain their order
      });
      setPositionPlayers(sortedPlayers); // Update the sorted position players
    } 
    // Sort the pitchers table
    else if (table === 'pitchers') {
      const sortedPitchers = [...pitchers].sort((a, b) => {
        if (a.stats[key] < b.stats[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a.stats[key] > b.stats[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0; // If values are equal, maintain their order
      });
      setPitchers(sortedPitchers); // Update the sorted pitchers
    }
  };

  return (
    <div className="roster-container">
      <h1>Miami Marlins Roster</h1> {/* Main heading for the page */}
      {loading ? (
        <p>Loading roster...</p> // Display a loading message while data is being fetched
      ) : (
        <div className="roster-tables">
          {/* Position Players Table */}
          <div>
            <h2>Position Players</h2> {/* Subheading for position players */}
            <table className="roster-table">
              <thead>
                <tr>
                  {/* Table headers with sorting functionality */}
                  <th onClick={() => handleSort('name', 'positionPlayers')}>Name</th>
                  <th onClick={() => handleSort('position', 'positionPlayers')}>Position</th>
                  <th onClick={() => handleSort('gamesPlayed', 'positionPlayers')}>Games Played</th>
                  <th onClick={() => handleSort('atBats', 'positionPlayers')}>At Bats</th>
                  <th onClick={() => handleSort('hits', 'positionPlayers')}>Hits</th>
                  <th onClick={() => handleSort('avg', 'positionPlayers')}>AVG</th>
                  <th onClick={() => handleSort('obp', 'positionPlayers')}>OBP</th>
                  <th onClick={() => handleSort('slg', 'positionPlayers')}>SLG</th>
                  <th onClick={() => handleSort('ops', 'positionPlayers')}>OPS</th>
                  <th onClick={() => handleSort('opsPlus', 'positionPlayers')}>OPS+</th>
                  <th onClick={() => handleSort('war', 'positionPlayers')}>WAR</th>
                </tr>
              </thead>
              <tbody>
                {/* Render position players dynamically */}
                {positionPlayers.map((player, index) => (
                  <tr key={index}>
                    <td>{player.name}</td>
                    <td>{player.position}</td>
                    <td>{player.stats.gamesPlayed || 'N/A'}</td>
                    <td>{player.stats.atBats || 'N/A'}</td>
                    <td>{player.stats.hits || 'N/A'}</td>
                    <td>{player.stats.avg || 'N/A'}</td>
                    <td>{player.stats.obp || 'N/A'}</td>
                    <td>{player.stats.slg || 'N/A'}</td>
                    <td>{player.stats.ops || 'N/A'}</td>
                    <td>{player.stats.opsPlus || 'N/A'}</td>
                    <td>{player.stats.war || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pitchers Table */}
          <div>
            <h2>Pitchers</h2> {/* Subheading for pitchers */}
            <table className="roster-table">
              <thead>
                <tr>
                  {/* Table headers with sorting functionality */}
                  <th onClick={() => handleSort('name', 'pitchers')}>Name</th>
                  <th onClick={() => handleSort('position', 'pitchers')}>Position</th>
                  <th onClick={() => handleSort('gamesPlayed', 'pitchers')}>Games Played</th>
                  <th onClick={() => handleSort('inningsPitched', 'pitchers')}>Innings Pitched</th>
                  <th onClick={() => handleSort('strikeOuts', 'pitchers')}>Strikeouts</th>
                  <th onClick={() => handleSort('era', 'pitchers')}>ERA</th> {/* Added ERA column */}
                </tr>
              </thead>
              <tbody>
                {/* Render pitchers dynamically */}
                {pitchers.map((player, index) => (
                  <tr key={index}>
                    <td>{player.name}</td>
                    <td>{player.position}</td>
                    <td>{player.stats.gamesPlayed || 'N/A'}</td>
                    <td>{player.stats.inningsPitched || 'N/A'}</td>
                    <td>{player.stats.strikeOuts || 'N/A'}</td>
                    <td>{player.stats.era || 'N/A'}</td> {/* Added ERA data */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roster; // Export the Roster component for use in other parts of the application