package com.blog.controller;

import com.blog.model.Comment;
import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.CommentRepository;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsByPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (!postRepository.existsById(postId)) {
            return ResponseEntity.notFound().build();
        }
        Page<Comment> result = commentRepository.findByPostIdOrderByCreatedAtDesc(
            postId, PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<?> addComment(@PathVariable Long postId, @RequestBody CommentRequest req) {
        if (req.content == null || req.content.isBlank()) {
            return ResponseEntity.badRequest().body("Comment content cannot be empty");
        }
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found: " + postId));
        
        Comment comment = new Comment();
        comment.setContent(req.content.trim());
        comment.setPost(post);
        comment.setAuthor(user);
        
        return ResponseEntity.ok(commentRepository.save(comment));
    }

    static class CommentRequest {
        public String content;
    }
}
