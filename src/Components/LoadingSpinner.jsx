export default function LoadingSpinner({ size = "20px", color = "black" }) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-dashed `}
      style={{
        width: size,
        height: size,
        borderColor: color,
      }}
    ></div>
  );
}
