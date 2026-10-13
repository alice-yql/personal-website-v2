# About photo reel

Put miscellaneous art, snapshots, and other photos for the scrolling reel in this folder.

To add a photo, add an image to this folder, then replace the matching `.about-reel-placeholder` block in both reel sets in `index.html` with:

```html
<img class="about-reel-image" src="assets/about-reel/my-photo.jpg" alt="A short description of the photo">
```

The reel loops automatically, moves from left to right, and pauses while hovered. It stays still when the visitor has enabled reduced motion.
