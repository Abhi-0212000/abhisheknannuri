---
id: "proj-4"
title: "Road Lane Detection System"
subtitle: "Computer Vision Based Advanced Driver Assistance"
category: "manipulation"
status: "Simulation"
tech: ["Python", "OpenCV", "TensorFlow", "Keras", "FCN8", "Sliding Window"]
githubUrl: "https://github.com/Abhi-0212000"
---
Developed a multi-approach lane detection system using classical computer vision, sliding window search, and deep semantic segmentation.

- **[1]** **Classical Pipeline**: OpenCV + Hough Transform, achieving 95% lane detection accuracy. HSV transformations and slope-intercept tracking improved lane-gap detection by 65%.
- **[2]** **Sliding Window Search**: Centroid tracking and Birds-Eye-View perspective matrices, improving curved road detection by 55% and reducing fail rates by 95% in adverse weather.
- **[3]** **Deep Learning (FCN8)**: Built a fully convolutional semantic segmentation network with VGG16 backbone trained on KITTI dataset, achieving 93% accuracy and 60 FPS processing speed.
