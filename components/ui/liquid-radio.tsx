export function GlassFilter() {
    return (
        <svg className="hidden">
            <defs>
                {/* Simplified glass filter for cross-browser consistency */}
                <filter
                    id="radio-glass"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                    colorInterpolationFilters="sRGB"
                >
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                        result="glow"
                    />
                    <feBlend in="SourceGraphic" in2="glow" mode="normal" />
                </filter>
            </defs>
        </svg>
    )
}
