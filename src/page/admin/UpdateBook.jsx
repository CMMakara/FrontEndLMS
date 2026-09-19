import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Select from "../../components/ui/Select";
import Input from '../../components/ui/Input'
import TextArea from '../../components/ui/Textarea'
import useCategory from '../../hook/useCategory'
import useAuthors from '../../hook/useAuthor'
import usePublisher from '../../hook/usePublishers'
import useBooks from "../../hook/useBooks";
import { useNavigate } from "react-router-dom";
const INITIAL_FORM = {
  category_id: "",
  author_id: "",
  publisher_id: "",
  book_title: "",
  isbn: "",
  edition: "",
  language: "",
  publish_year: "",
  pages: "",
  total_copies: "",
  available_copies: "",
  shelf_location: "",
  description: "",
  thumbnail: null,
  status: ""
};

function Section({ icon, title, accent, children }) {
  const colors = {
    blue: { bg: "#e6f1fb", text: "#185FA5", border: "#b5d4f4" },
    green: { bg: "#eaf3de", text: "#3B6D11", border: "#c0dd97" },
    amber: { bg: "#faeeda", text: "#854F0B", border: "#fac775" },
  };
  const c = colors[accent] ?? colors.blue;

  return (
    <div
      className="rounded-4 p-3 h-100"
      style={{ border: `1px solid ${c.border}`, background: "#fff" }}
    >
      <div
        className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-3"
        style={{ background: c.bg }}
      >
        <i className={`bi ${icon}`} style={{ color: c.text, fontSize: 16 }} />
        <span
          className="fw-semibold"
          style={{ color: c.text, fontSize: 13, letterSpacing: ".01em" }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function UpdateBook() {
  const { id } = useParams()
  const [form, setForm] = useState(INITIAL_FORM);
  const [preview, setPreview] = useState(null);
  const [isDrag, setIsDrag] = useState(false);
  const fileInputRef = useRef(null);
  const { category } = useCategory(1, { per_page: 1000 })
  const { author } = useAuthors(1, { per_page: 1000 })
  const { publishers } = usePublisher()
  const { getBooksById, updateBook, uploadImageBook } = useBooks()
  const navigate = useNavigate();

  useEffect(() => {
    getBookByID()
  }, [id])

  const getBookByID = async () => {
    const res = await getBooksById(id)
    const data = res?.data;
    if (!data) return;
    setForm({
      ...INITIAL_FORM,
      category_id: data.category_id ?? "",
      author_id: data.author_id ?? "",
      publisher_id: data.publisher_id ?? "",
      book_title: data.book_title ?? "",
      isbn: data.isbn ?? "",
      edition: data.edition ?? "",
      language: data.language ?? "",
      publish_year: data.publish_year ?? "",
      pages: data.pages ?? "",
      total_copies: data.total_copies ?? "",
      available_copies: data.available_copies ?? "",
      shelf_location: data.shelf_location ?? "",
      description: data.description ?? "",
      status: data.status ?? "",
    });
    const image = data?.thumbnail;

    if (image && typeof image === "string" && image.trim()) {
      const cleanBase = import.meta.env.VITE_API_URL.replace(/\/$/, "");
      setPreview(
        image.startsWith("http")
          ? image
          : `${cleanBase}/${image}`
      );
    }
  }

  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    setForm((prev) => ({
      ...prev,
      thumbnail: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    applyFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { thumbnail, ...formData } = form;

    const payload = {
      ...formData,
      category_id: form.category_id ? Number(form.category_id) : null,
      author_id: form.author_id ? Number(form.author_id) : null,
      publisher_id: form.publisher_id ? Number(form.publisher_id) : null,
      publish_year: form.publish_year ? Number(form.publish_year) : null,
      pages: form.pages ? Number(form.pages) : null,
      total_copies: form.total_copies ? Number(form.total_copies) : null,
      available_copies: form.available_copies ? Number(form.available_copies) : null,
    };


    const res = await updateBook(id, payload);
    if (!res) return;

    if (thumbnail instanceof File) {
      await uploadImageBook(id, thumbnail);
    }

    navigate("/admin/books");
  };
  return (
    <div
      className="container-fluid py-4 px-4"
      style={{ background: "#f4f6fb", minHeight: "100vh" }}
    >
      {/* PAGE HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: 22 }}>
          <i className="bi bi-journal-plus me-2 text-primary" />
          Update Book
        </h2>
        <p className="text-muted mb-0" style={{ fontSize: 14 }}>
          Fill in all required book information
        </p>
      </div>

      {/* CARD */}
      <div
        className="card border-0"
        style={{ borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,.07)" }}
      >
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>

            {/* ── COVER UPLOAD ── */}
            <div className="d-flex justify-content-center mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileInput}
              />

              <div
                className="cover-wrapper"
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
                onDragLeave={() => setIsDrag(false)}
                onDrop={handleDrop}
                style={{
                  width: 160,
                  height: 220,
                  borderRadius: 14,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  border: preview
                    ? "none"
                    : `2px dashed ${isDrag ? "#378add" : "#b5d4f4"}`,
                  background: preview
                    ? "transparent"
                    : isDrag ? "#e6f1fb" : "#f8fafd",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "border-color .15s, background .15s",
                }}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="book cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 14,
                        display: "block",
                      }}
                    />
                    {/* hover overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,.45)",
                        borderRadius: 14,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        opacity: 0,
                        transition: "opacity .15s",
                      }}
                      className="cover-hover-overlay"
                    >
                      <i
                        className="bi bi-camera"
                        style={{ fontSize: 24, color: "#fff" }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#fff",
                          background: "rgba(255,255,255,.15)",
                          border: "1px solid rgba(255,255,255,.3)",
                          borderRadius: 20,
                          padding: "5px 14px",
                        }}
                      >
                        Change cover
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "#e6f1fb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="bi bi-cloud-arrow-up"
                        style={{ fontSize: 24, color: "#185FA5" }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      Upload book cover
                    </span>
                    <span
                      style={{ fontSize: 12, color: "#94a3b8" }}
                    >
                      or drag &amp; drop here
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#b0bec5",
                        marginTop: 2,
                      }}
                    >
                      PNG · JPG · JPEG
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* ── THREE SECTION COLUMNS ── */}
            <div className="row gy-3 mb-3">

              {/* Relations */}
              <div className="col-lg-4">
                <Section icon="bi-diagram-3" title="Relations" accent="blue" className='p-5'>
                  {/* categroy */}
                  <div className="mb-3">
                    <Select
                      placeholder="Chosse category name"
                      width="100%"
                      label="Category Name"
                      value={form.category_id}
                      onChange={(e) => {
                        const value = e.target.value;
                        setField("category_id", value);
                      }}
                      options={[
                        {
                          value: "",
                          label: "-- Select Category --"
                        },
                        ...(category?.map((data) => ({
                          value: data.id,
                          label: data.category_name
                        })) || [])
                      ]}
                    />
                  </div>
                  {/* Author */}
                  <div className="mb-3">
                    <Select
                      width="100%"
                      label="Author Name"
                      value={form.author_id}
                      placeholder="Select author Name"
                      onChange={(e) => {
                        const value = e.target.value;
                        setField("author_id", value);
                      }}
                      options={[
                        {
                          value: "",
                          label: "-- Select Author --"
                        },
                        ...(author?.map((data) => ({
                          value: data.id,
                          label: data.author_name
                        })) || [])
                      ]}
                    />
                  </div>
                  {/* Publisher */}
                  <div className="mb-3">
                    <Select
                      width="100%"
                      label="Publisher Name"
                      placeholder="Select Publisher Name"
                      value={form.publisher_id}
                      onChange={(e) => {
                        const value = e.target.value;
                        setField("publisher_id", value);
                      }}
                      options={[
                        {
                          value: "",
                          label: "-- Select Publisher --"
                        },
                        ...(publishers?.map((data) => ({
                          value: data.id,
                          label: data.publisher_name
                        })) || [])
                      ]}
                    />
                  </div>
                </Section>
              </div>

              {/* Book Information */}
              <div className="col-lg-4">
                <Section icon="bi-book" title="Book information" accent="green">
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="Book title"
                      icon="bi-book"
                      placeholder="Enter Book Title"
                      name='book_title'
                      value={form.book_title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="ISBN"
                      name='isbn'
                      value={form.isbn}
                      placeholder="978-3-16-148410-0"
                      icon="bi-qr-code-scan"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="Edition"
                      name='edition'
                      value={form.edition}
                      placeholder="e.g. 3rd"
                      icon="bi-layers"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="Language"
                      name='language'
                      value={form.language}
                      placeholder="e.g. English"
                      icon="bi-translate"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Select
                      label="Status"
                      name="status"
                      placeholder='Selete status'
                      width='100%'
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value)}
                      options={[
                        { value: "available", label: "🟢 Available" },
                        { value: "unavailable", label: "🔴 Unavailable" },
                        { value: "damaged", label: "🟠 Damaged" },
                        { value: "archived", label: "⚫ Archived" },
                      ]}
                    />
                  </div>
                </Section>
              </div>

              {/* Stock & System */}
              <div className="col-lg-4">
                <Section icon="bi-box-seam" title="Stock & system" accent="amber">
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="Publish year"
                      placeholder="e.g. 2022"
                      name='publish_year'
                      value={form.publish_year}
                      icon="bi bi-calendar-event"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="Pages"
                      placeholder="e.g. 320"
                      name='pages'
                      value={form.pages}
                      icon="bi bi-file-earmark-text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="Total copies"
                      placeholder="e.g. 20"
                      name='total_copies'
                      value={form.total_copies}
                      icon="bi bi-collection"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="Available copies"
                      placeholder="e.g. 20"
                      name='available_copies'
                      value={form.available_copies}
                      icon="bi bi-check-circle"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      width="100%"
                      label="Shelf location"
                      placeholder="e.g. A-12"
                      name='shelf_location'
                      value={form.shelf_location}
                      icon="bi bi-geo-alt"
                      onChange={handleChange}
                    />
                  </div>
                </Section>
              </div>
            </div>

            {/* ── DESCRIPTION ── */}
            <div
              className="rounded-4 p-3 mb-3"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <TextArea
                width="100%"
                placeholder="description"
                name='description'
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div className="d-flex justify-content-end gap-2 pt-1">
              <button
                type="button"
                className="btn btn-light px-4"
                style={{ fontSize: 13, borderRadius: 10 }}
                onClick={() => navigate("/admin/books")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn text-white px-4"
                style={{
                  fontSize: 13,
                  borderRadius: 10,
                  background: "#185FA5",
                  border: "none",
                }}
              >
                <i className="bi bi-plus-circle me-2" />
                Update book
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Hover overlay CSS (tiny — avoids inline onMouseEnter/Leave) */}
      <style>{`
        .cover-hover-overlay { pointer-events: none; }
        div:hover > .cover-hover-overlay { opacity: 1 !important; pointer-events: auto; }
      `}</style>
    </div>
  );
}

export default UpdateBook
