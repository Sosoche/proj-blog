package com.blog.repository;

import com.blog.model.Post;
import com.blog.model.Rating;
import com.blog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndPost(User user, Post post);

    @Query("SELECT AVG(r.value) FROM Rating r WHERE r.post.id = :postId")
    Double findAverageByPostId(Long postId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.post.id = :postId")
    Long countByPostId(Long postId);
}
