(function () {
  const homeLink = document.querySelector(
    '.md-tabs__item--active a[href="."]'
  );

  if (homeLink) {
    document.body.classList.add("homepage");
  }
})();

document.addEventListener("DOMContentLoaded", function () {

    const terminal = document.getElementById("terminal");

    if (!terminal) {
        return;
    }

    const minimize = terminal.querySelector(".terminal-minimize");
    const maximize = terminal.querySelector(".terminal-maximize");
    const close = terminal.querySelector(".terminal-close");


    /* -------------------------
       MAXIMIZE
       ------------------------- */

    maximize.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        terminal.classList.remove("is-minimized");
        terminal.classList.toggle("is-maximized");

        if (terminal.classList.contains("is-maximized")) {

            maximize.textContent = "❐";
            maximize.setAttribute("aria-label", "Restore");
            maximize.setAttribute("title", "Restore");

        } else {

            maximize.textContent = "□";
            maximize.setAttribute("aria-label", "Maximize");
            maximize.setAttribute("title", "Maximize");

        }

    });


    /* -------------------------
       MINIMIZE
       ------------------------- */

    minimize.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        terminal.classList.remove("is-maximized");
        terminal.classList.toggle("is-minimized");

    });


    /* -------------------------
       CLOSE
       ------------------------- */

    close.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        terminal.classList.remove("is-maximized");
        terminal.classList.remove("is-minimized");

        terminal.classList.add("is-closed");

    });


    /* -------------------------
       ESCAPE TO RESTORE
       ------------------------- */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            if (terminal.classList.contains("is-maximized")) {

                terminal.classList.remove("is-maximized");

                maximize.textContent = "□";

                maximize.setAttribute(
                    "aria-label",
                    "Maximize"
                );

                maximize.setAttribute(
                    "title",
                    "Maximize"
                );

            }

        }

    });

});
