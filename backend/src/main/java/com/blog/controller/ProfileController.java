package com.blog.controller;

import com.blog.model.Comment;
import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.CommentRepository;
import com.blog.repository.PostRepository;
import com.blog.repository.RatingRepository;
import com.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private RatingRepository ratingRepository;

    
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> myProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        List<Post> posts = postRepository.findAll().stream()
            .filter(p -> p.getAuthor() != null && p.getAuthor().getId().equals(user.getId()))
            .toList();

        double avgRating = posts.stream()
            .mapToDouble(p -> {
                Double avg = ratingRepository.findAverageByPostId(p.getId());
                return avg != null ? avg : 0.0;
            })
            .average()
            .orElse(0.0);

        List<Comment> recentComments = commentRepository.findRecentCommentsOnUserPosts(
            user.getId(), PageRequest.of(0, 5, Sort.by("createdAt").descending())
        );

        Map<String, Object> result = new HashMap<>();
        result.put("username", user.getUsername());
        result.put("email", user.getEmail());
        result.put("postCount", posts.size());
        result.put("averageRating", Math.round(avgRating * 10.0) / 10.0);
        result.put("recentComments", recentComments);
        result.put("posts", posts);
        return ResponseEntity.ok(result);
    }

    
    @GetMapping("/{username}")
    public ResponseEntity<Map<String, Object>> publicProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        List<Post> posts = postRepository.findAll().stream()
            .filter(p -> p.getAuthor() != null && p.getAuthor().getId().equals(user.getId()))
            .toList();

        double avgRating = posts.stream()
            .mapToDouble(p -> {
                Double avg = ratingRepository.findAverageByPostId(p.getId());
                return avg != null ? avg : 0.0;
            })
            .average()
            .orElse(0.0);

        Map<String, Object> result = new HashMap<>();
        result.put("username", user.getUsername());
        result.put("postCount", posts.size());
        result.put("averageRating", Math.round(avgRating * 10.0) / 10.0);
        result.put("posts", posts);
        return ResponseEntity.ok(result);
    }
}
