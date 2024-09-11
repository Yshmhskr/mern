import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Record component
const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch records based on search criteria and initial load
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`http://localhost:5050/record?search=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const records = await response.json();
        setRecords(records);
      } catch (error) {
        console.error(error.message);
      }
    }

    getRecords();
  }, [searchQuery]); // Fetch records on search query change

  // Delete a record
  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:5050/record/${id}`, {
        method: "DELETE",
      });
      setRecords(records.filter((el) => el._id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }

  // Handle search input change
  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  // Map out the records on the table
  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={() => deleteRecord(record._id)}
        key={record._id}
      />
    ));
  }

  // Display the table with the records of individuals
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      
      {/* Search input field and button */}
      <form
        className="p-4"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          // No additional code needed here; useEffect handles fetching
        }}
      >
        <input
          type="text"
          placeholder="Search by name or level"
          value={searchQuery}
          onChange={handleSearchChange} // Update search query on input change
          className="border rounded p-2 mr-2"
        />
        <button
          type="submit" // Button type set to submit
          className="border rounded p-2 bg-blue-500 text-white"
        >
          Search
        </button>
      </form>

      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&:has([role=checkbox])]:pr-0">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&:has([role=checkbox])]:pr-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
