package com.blog.controller;

import com.blog.model.Post;
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
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public Page<Post> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        if (search != null && !search.isEmpty()) {
            return postRepository.findByTitleContainingIgnoreCase(search, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        }
        return postRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        com.blog.model.User user = userRepository.findByUsername(username).orElseThrow();
        post.setAuthor(user);
        return postRepository.save(post);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return postRepository.findById(id).map(post -> {
            if (!post.getAuthor().getUsername().equals(username)) {
                return ResponseEntity.status(403).body("You can only delete your own posts");
            }
            postRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
