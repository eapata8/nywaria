const gallery_pictures = import.meta.glob("../assets/gallery_pictures/*.{png,jpg,jpeg}", {
  eager: true,
});

export default function Gallery() {
  return (
    <div>
      {Object.values(gallery_pictures).map((img, index) => (
        <img key={index} src={img.default} alt={`img-${index}`} />
      ))}
    </div>
  );
}

