import React, { useEffect } from "react";
import "src/assets/css/CircularProgressBar.css";

const CircularProgress = () => {
  useEffect(() => {
    // Wait for DOM to load
    const pie = document.querySelectorAll(".pie");
    const range = document.querySelector('[type="range"]');

    const circle = new CircularProgressBar("pie");

    // Update circle when range changes
    const onRangeChange = (e) => {
      pie.forEach((_, index) => {
        const options = {
          index: index + 1,
          percent: e.target.value,
        };
        circle.animationTo(options);
      });
    };

    range.addEventListener("input", onRangeChange);

    // Start the animation when the element is in the page view
    const elements = [].slice.call(document.querySelectorAll(".pie"));

    if ("IntersectionObserver" in window) {
      const config = { root: null, rootMargin: "0px", threshold: 0.75 };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
            circle.initial(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, config);

      elements.forEach((item) => observer.observe(item));
    } else {
      elements.forEach((element) => {
        circle.initial(element);
      });
    }

    // Random update every 3 seconds
    const interval = setInterval(() => {
      const typeFont = [100, 200, 300, 400, 500, 600, 700];
      const colorHex = `#${Math.floor((Math.random() * 0xffffff) << 0).toString(
        16
      )}`;
      const options = {
        index: 17,
        percent: Math.floor(Math.random() * 100 + 1),
        colorSlice: colorHex,
        fontColor: colorHex,
        fontSize: `${Math.floor(Math.random() * (1.4 - 1 + 1) + 1)}rem`,
        fontWeight: typeFont[Math.floor(Math.random() * typeFont.length)],
      };
      circle.animationTo(options);
    }, 3000);

    // Global config
    const globalConfig = {
      speed: 30,
      animationSmooth: "1s ease-out",
      strokeBottom: 5,
      colorSlice: "#FF6D00",
      colorCircle: "#f1f1f1",
      round: true,
    };

    const global = new CircularProgressBar("global", globalConfig);
    global.initial();

    const pieGlobal = document.querySelectorAll(".global");
    const onGlobalRangeChange = (e) => {
      pieGlobal.forEach((_, index) => {
        const options = {
          index: index + 1,
          percent: e.target.value,
        };
        global.animationTo(options);
      });
    };

    range.addEventListener("input", onGlobalRangeChange);

    document.querySelectorAll("pre code").forEach((el) => {
      if (window.hljs) {
        window.hljs.highlightElement(el);
      }
    });

    const infoCode = document.querySelectorAll(".info-code");
    infoCode.forEach((info) => {
      info.addEventListener("click", (e) => {
        e.target.closest("section").classList.toggle("show-code");
      });
    });

    return () => {
      range.removeEventListener("input", onRangeChange);
      range.removeEventListener("input", onGlobalRangeChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container">
      <h1>React Circular Progress</h1>
      <div className="progress-wrapper flex">
        <input type="range" min="0" max="100" defaultValue="50" />
        <section>
          <div className="pie"></div>
        </section>
        <section>
          <div className="pie global"></div>
        </section>
      </div>
    </div>
  );
};

export default CircularProgress;
