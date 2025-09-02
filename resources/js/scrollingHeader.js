export default function scrollingHeader() {
    return {
        top: 0,
        maxTop: 0,
        lastScrollY: 0,
        headerEl: null,
        spacerEl: null,

        init() {
            this.$nextTick(() => {
                this.headerEl = this.$refs.header;
                this.spacerEl = this.$refs.spacer;

                this.updateHeaderHeight();
                this.lastScrollY = window.scrollY;

                window.addEventListener(
                    "scroll",
                    () => {
                        requestAnimationFrame(() => this.handleScroll());
                    },
                    { passive: true },
                );

                window.addEventListener("resize", () => {
                    this.updateHeaderHeight();
                });
            });
        },

        updateHeaderHeight() {
            const height = this.headerEl?.offsetHeight || 0;
            this.maxTop = -height;
            if (this.spacerEl) this.spacerEl.style.height = `${height}px`;
        },

        handleScroll() {
            const current = window.scrollY;
            const delta = current - this.lastScrollY;

            if (current <= 0) this.top = 0;
            else if (delta > 0)
                this.top = Math.max(this.top - delta, this.maxTop); // down
            else if (delta < 0) this.top = Math.min(this.top - delta, 0); // up

            this.lastScrollY = current;
        },
    };
}
