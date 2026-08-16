type NexusOrbitMarkProps = {
  className?: string
  labels?: boolean
}

export default function NexusOrbitMark({ className = '', labels = true }: NexusOrbitMarkProps) {
  return (
    <div className={`nexus-orbit-mark ${className}`.trim()} aria-hidden="true">
      <div className="nexus-orbit-ring nexus-orbit-ring-a" />
      <div className="nexus-orbit-ring nexus-orbit-ring-b" />
      <div className="nexus-orbit-ring nexus-orbit-ring-c" />
      <div className="nexus-orbit-core">
        <strong>N</strong>
        <span>NEXUS</span>
      </div>
      {labels ? <>
        <span className="nexus-orbit-label is-city">CITY</span>
        <span className="nexus-orbit-label is-business">BUSINESS</span>
        <span className="nexus-orbit-label is-service">SERVICE</span>
      </> : null}
    </div>
  )
}
