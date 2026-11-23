package com.project.parking.Service;

import java.util.List;

import org.jspecify.annotations.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.parking.DTOs.LoginRequest;
import com.project.parking.DTOs.RegisterRequest;
import com.project.parking.DTOs.RegisterResponse;
import com.project.parking.DTOs.UserResponse;
import com.project.parking.Entity.Roles;
import com.project.parking.Entity.User;
import com.project.parking.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(Roles.USER);

        User savedUser = userRepository.save(user);

        RegisterResponse response = modelMapper.map(savedUser, RegisterResponse.class);

        return response;
    }

    public User authenticate(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or Password");
        }

        return user;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> {
                    UserResponse response = new UserResponse();

                    response.setId(user.getId());
                    response.setUsername(user.getUsername());
                    response.setRole(user.getRole());

                    return response;
                })
                .toList();
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return modelMapper.map(user, UserResponse.class);
    }
}
