package com.blog.repository;

import com.blog.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);
    Page<Comment> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);

    
    @Query("SELECT c FROM Comment c WHERE c.post.author.id = :userId AND (c.author IS NULL OR c.author.id <> :userId) ORDER BY c.createdAt DESC")
    List<Comment> findRecentCommentsOnUserPosts(Long userId, Pageable pageable);
}
