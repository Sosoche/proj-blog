package com.blog.controller;

import com.blog.model.Post;
import com.blog.model.Rating;
import com.blog.model.User;
import com.blog.repository.PostRepository;
import com.blog.repository.RatingRepository;
import com.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/post/{postId}")
    public ResponseEntity<Map<String, Object>> getRating(@PathVariable Long postId) {
        Double avg = ratingRepository.findAverageByPostId(postId);
        Long count = ratingRepository.countByPostId(postId);

        Map<String, Object> result = new HashMap<>();
        result.put("average", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        result.put("count", count);

        String username = getUsername();
        if (username != null) {
            userRepository.findByUsername(username).flatMap(user ->
                postRepository.findById(postId).flatMap(post ->
                    ratingRepository.findByUserAndPost(user, post)
                )
            ).ifPresent(r -> result.put("userRating", r.getValue()));
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<?> submitRating(@PathVariable Long postId, @RequestBody RatingRequest req) {
        if (req.value < 1 || req.value > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }

        String username = getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        Rating rating = ratingRepository.findByUserAndPost(user, post)
            .orElse(new Rating());

        rating.setValue(req.value);
        rating.setUser(user);
        rating.setPost(post);
        ratingRepository.save(rating);

        return getRating(postId);
    }

    private String getUsername() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return auth.getName();
    }

    static class RatingRequest {
        public int value;
    }
}
