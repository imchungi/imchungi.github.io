tailwind.config = {
  corePlugins: {
    preflight: false,  // 기존 HTML의 자체 CSS와 충돌 방지
  },
  theme: {
    extend: {
      colors: {
        neon:    '#00FF7F',
        neon2:   '#CCFF00',
        purple:  '#7000FF',
        bg:      '#0a0a0a',
        bg2:     '#111111',
        card:    '#161616',
        line:    '#222222',
        content: '#e0e0e0',
        muted:   '#666666',
      },
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'sans-serif'],
        noto:   ['"Noto Sans KR"', 'sans-serif'],
        mono:   ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
}
