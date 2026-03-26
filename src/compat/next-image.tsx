import * as React from "react"

type NextImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  unoptimized?: boolean
  sizes?: string
}

export default function Image({
  fill,
  style,
  width,
  height,
  src,
  alt,
  priority: _priority,
  unoptimized: _unoptimized,
  ...rest
}: NextImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          ...style,
        }}
        {...rest}
      />
    )
  }

  return <img src={src} alt={alt} width={width} height={height} style={style} {...rest} />
}
