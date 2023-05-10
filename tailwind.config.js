
tailwind.config = {
  theme: {
    extend: {
      boxShadow: {
        insetBoxShadow: "0px -3px 2px 2px inset rgba(0,0,0, 0.2)"
      },
      minHeight:{
        spHeight: "calc(100vh - 64px)",
        spSecHeight: "57vh",
      },
      backgroundSize: {
        "size-600": "600px"
      },
      animation: {
        "popUp": "popUp .6s ease forwards",
        "popClose": "popClose .6s ease forwards",
        "backgroundMoves": "backgroundMoves 15s linear infinite",
      },
      keyframes: {
        "popUp": {
          "0%": { transform: "translate(-50%, 100%) scale(0)" },
          "50%": { transform: "translate(-50%, 60%) scale(1.5)" },
          "100%": { transform: "translate(-50%, -50%) scale(1)" },
        },
        "popClose": {
          "0%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, 30%) scale(1.3)" },
          "100%": { transform: "translate(-50%, 100%) scale(0)" },
        },
        "backgroundMoves": {
          "0%": { "background-position-y": "0" },
          "100%": { "background-position-y": "700px" },
        }
      }
    }
  }
};