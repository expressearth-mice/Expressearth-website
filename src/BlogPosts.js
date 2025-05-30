// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Nav, Tab, Form, FormControl, Button, Card, Container, Row, Col } from "react-bootstrap";

// const BlogPosts = () => {
//   const [posts, setPosts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8000/api/posts/")
//       .then((response) => {
//         setPosts(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the posts!", error);
//       });
//   }, []);

//   const filteredPosts = posts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Container className="mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h1>Blog Posts</h1>
//         <Form className="d-flex">
//           <FormControl
//             type="search"
//             placeholder="Search blogs..."
//             className="me-2"
//             aria-label="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Button variant="outline-primary">Search</Button>
//         </Form>
//       </div>

//       <Tab.Container defaultActiveKey="recent">
//         <Nav variant="tabs">
//           <Nav.Item>
//             <Nav.Link eventKey="recent">Recent Blogs</Nav.Link>
//           </Nav.Item>
//           <Nav.Item>
//             <Nav.Link eventKey="trending">Trending Blogs</Nav.Link>
//           </Nav.Item>
//         </Nav>

//         <Tab.Content className="mt-3">
//           <Tab.Pane eventKey="recent">
//             {filteredPosts.length === 0 ? (
//               <p>No posts available.</p>
//             ) : (
//               <Row className="card-columns">
//                 {filteredPosts.map((post) => (
//                   <Col key={post.id} md={4} className="mb-4">
//                     <Card className="h-100">
//                       {post.image && (
//                         <Card.Img variant="top" src={`http://127.0.0.1:8000${post.image}`} alt={post.title} />
//                       )}
//                       <Card.Body>
//                         <Card.Title>{post.title}</Card.Title>
//                         <Card.Text>{post.description}</Card.Text>
//                       </Card.Body>
//                       {post.video_url && (
//                         <div className="p-3">
//                           <iframe
//                             src={post.video_url}
//                             title={post.title}
//                             frameBorder="0"
//                             allowFullScreen
//                             className="w-100"
//                           ></iframe>
//                         </div>
//                       )}
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             )}
//           </Tab.Pane>

//           <Tab.Pane eventKey="trending">
//             <p>Trending blogs will be displayed here.</p>
//           </Tab.Pane>
//         </Tab.Content>
//       </Tab.Container>
//     </Container>
//   );
// };

// export default BlogPosts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function BlogPost() {
  const { title } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/posts/?title=${encodeURIComponent(title)}`);
        const data = response.data;

        if (data.length > 0) {
          setPost(data[0]); // assuming titles are unique
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [title]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center mt-5">Blog post not found.</div>;
  }

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-secondary mb-3">← Back to Blog List</Link>
      <h1>{post.title}</h1>
      <img src={post.image} alt={post.title} className="img-fluid rounded mb-3" />
      <p>{post.description}</p>
      <p>
        <small className="text-muted">
          Last updated: {new Date(post.updated_at).toDateString()}
        </small>
      </p>
    </div>
  );
}

export default BlogPost;
