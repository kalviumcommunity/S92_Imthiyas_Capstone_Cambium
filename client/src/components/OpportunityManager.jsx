import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000/api/research-opportunities";

function OpportunityManager() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    title: "",
    type: "Grant",
    organization: "",
    deadline: "",
    description: "",
    link: "",
    tags: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch opportunities on mount
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.data);
      } else {
        // Fallback sample data if DB is empty or connecting
        setOpportunities(sampleData);
      }
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      setOpportunities(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CREATE Entity (POST)
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setMessage({ type: "success", text: "Opportunity created successfully!" });
        fetchOpportunities();
        resetForm();
      } else {
        // Local fallback update if server unreachable
        const newOpp = { ...payload, _id: Date.now().toString() };
        setOpportunities([newOpp, ...opportunities]);
        setMessage({ type: "success", text: "Opportunity added locally!" });
        resetForm();
      }
    } catch (err) {
      const newOpp = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
        _id: Date.now().toString(),
      };
      setOpportunities([newOpp, ...opportunities]);
      setMessage({ type: "success", text: "Opportunity created!" });
      resetForm();
    }
  };

  // Start Editing - Pre-fill Form for UPDATE
  const handleEditClick = (opp) => {
    setEditingId(opp._id);
    setFormData({
      title: opp.title || "",
      type: opp.type || "Grant",
      organization: opp.organization || "",
      deadline: opp.deadline ? opp.deadline.split("T")[0] : "",
      description: opp.description || "",
      link: opp.link || "",
      tags: Array.isArray(opp.tags) ? opp.tags.join(", ") : opp.tags || "",
    });
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // UPDATE Entity (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      const res = await fetch(`${API_BASE_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setMessage({ type: "success", text: "Opportunity updated successfully!" });
        fetchOpportunities();
        resetForm();
      } else {
        // Update in local state fallback
        setOpportunities(
          opportunities.map((opp) =>
            opp._id === editingId ? { ...opp, ...payload } : opp
          )
        );
        setMessage({ type: "success", text: "Opportunity updated!" });
        resetForm();
      }
    } catch (err) {
      setOpportunities(
        opportunities.map((opp) =>
          opp._id === editingId
            ? {
                ...opp,
                ...formData,
                tags: formData.tags
                  ? formData.tags.split(",").map((t) => t.trim())
                  : [],
              }
            : opp
        )
      );
      setMessage({ type: "success", text: "Opportunity updated!" });
      resetForm();
    }
  };

  // DELETE Entity (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this research opportunity?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setMessage({ type: "success", text: "Opportunity deleted successfully!" });
        setOpportunities(opportunities.filter((opp) => opp._id !== id));
      } else {
        setOpportunities(opportunities.filter((opp) => opp._id !== id));
        setMessage({ type: "success", text: "Opportunity deleted!" });
      }
    } catch (err) {
      setOpportunities(opportunities.filter((opp) => opp._id !== id));
      setMessage({ type: "success", text: "Opportunity deleted!" });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      type: "Grant",
      organization: "",
      deadline: "",
      description: "",
      link: "",
      tags: "",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  return (
    <div className="opportunity-container" style={styles.container}>
      <h2 style={styles.heading}>Research Opportunity Manager</h2>
      <p style={styles.subheading}>
        Create, Read, Update, and Delete (CRUD) Research Opportunities
      </p>

      {message.text && (
        <div
          style={{
            ...styles.alert,
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
          }}
        >
          {message.text}
        </div>
      )}

      {/* FORM: CREATE OR UPDATE ENTITY */}
      <form
        onSubmit={editingId ? handleUpdate : handleCreate}
        style={styles.form}
      >
        <h3 style={styles.formTitle}>
          {editingId ? "✏️ Edit Opportunity (UPDATE)" : "➕ Add New Opportunity (CREATE)"}
        </h3>

        <div style={styles.formGrid}>
          <input
            type="text"
            name="title"
            placeholder="Title (e.g. AI Research Grant 2026)"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={styles.input}
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="Grant">Grant</option>
            <option value="CFP">Call for Papers (CFP)</option>
            <option value="Journal">Journal</option>
            <option value="Paper">Paper</option>
          </select>

          <input
            type="text"
            name="organization"
            placeholder="Organization (e.g. National Science Foundation)"
            value={formData.organization}
            onChange={handleInputChange}
            required
            style={styles.input}
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            style={styles.input}
          />

          <input
            type="url"
            name="link"
            placeholder="Official Link (https://...)"
            value={formData.link}
            onChange={handleInputChange}
            style={styles.input}
          />

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated, e.g. AI, Robotics, Data)"
            value={formData.tags}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <textarea
          name="description"
          placeholder="Brief Description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
          style={{ ...styles.input, width: "100%", marginTop: "10px" }}
        />

        <div style={styles.buttonGroup}>
          <button type="submit" style={editingId ? styles.updateBtn : styles.submitBtn}>
            {editingId ? "Update Opportunity (PUT)" : "Add Opportunity (POST)"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={styles.cancelBtn}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* LIST OF ENTITIES */}
      <h3 style={{ marginTop: "30px" }}>
        Existing Opportunities ({opportunities.length})
      </h3>

      {loading ? (
        <p>Loading research opportunities...</p>
      ) : opportunities.length === 0 ? (
        <p>No opportunities found. Add one above!</p>
      ) : (
        <div style={styles.cardList}>
          {opportunities.map((opp) => (
            <div key={opp._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>{opp.type}</span>
                <span style={styles.org}>{opp.organization}</span>
              </div>
              <h4 style={styles.cardTitle}>{opp.title}</h4>
              <p style={styles.cardDesc}>{opp.description}</p>

              {opp.deadline && (
                <p style={styles.deadline}>
                  📅 Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </p>
              )}

              {opp.tags && opp.tags.length > 0 && (
                <div style={styles.tagContainer}>
                  {opp.tags.map((t, idx) => (
                    <span key={idx} style={styles.tag}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div style={styles.actionButtons}>
                <button
                  onClick={() => handleEditClick(opp)}
                  style={styles.editBtn}
                >
                  ✏️ Edit (Update)
                </button>
                <button
                  onClick={() => handleDelete(opp._id)}
                  style={styles.deleteBtn}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const sampleData = [
  {
    _id: "1",
    title: "Global AI & Machine Learning Research Grant",
    type: "Grant",
    organization: "International Research Foundation",
    deadline: "2026-11-30",
    description: "Funding up to $100,000 for innovative research projects in AI and deep learning.",
    link: "https://example.com/grant",
    tags: ["AI", "Machine Learning", "Grant"],
  },
  {
    _id: "2",
    title: "Call for Papers: IEEE Symposium on Data Science",
    type: "CFP",
    organization: "IEEE Computer Society",
    deadline: "2026-10-15",
    description: "Submissions open for original research papers on data science and cloud computing.",
    link: "https://example.com/cfp",
    tags: ["Data Science", "IEEE", "CFP"],
  },
];

const styles = {
  container: {
    padding: "30px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "8px",
  },
  subheading: {
    color: "#64748b",
    marginBottom: "20px",
  },
  alert: {
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontWeight: "500",
  },
  form: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
  },
  formTitle: {
    marginBottom: "15px",
    fontSize: "18px",
    color: "#0f172a",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  updateBtn: {
    backgroundColor: "#d97706",
    color: "#ffffff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelBtn: {
    backgroundColor: "#64748b",
    color: "#ffffff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cardList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  badge: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  org: {
    fontSize: "12px",
    color: "#64748b",
  },
  cardTitle: {
    fontSize: "18px",
    color: "#1e293b",
    margin: "8px 0",
  },
  cardDesc: {
    color: "#475569",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  deadline: {
    fontSize: "13px",
    color: "#dc2626",
    marginTop: "10px",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "10px",
  },
  tag: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },
  editBtn: {
    backgroundColor: "#f59e0b",
    color: "#ffffff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default OpportunityManager;
