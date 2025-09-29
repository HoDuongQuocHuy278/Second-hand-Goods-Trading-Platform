<template>
    <div class="container">
        <div class="row">
            <div class="card">
                <div class="row">
                    <div class="content">
                        <h2 class="text-center mt-3 mb-3">Cam thúi</h2>
                        <div class="text-center">
                            <video id="videoPlayer" controls autoplay playsinline></video>
                        </div>



                    </div>

                </div>
                <div class="row">
                    <div class="text-center">

                        <label>Lesson:</label>
                        <select @change="onPlaylistChange">
                            <option value="0" selected>Lesson_1</option>
                            <option value="1">Lesson_2</option>
                        </select>

                        <label>Video:</label>
                        <select @change="onVideoChange" ref="videoSelect">
                            <option style="width: 300px;" v-for="(video, index) in videoList" :value="index"
                                :key="index">
                                {{ video.title }}
                            </option>
                        </select>

                        <br><br>
                        <label>
                            <input type="checkbox" id="repeatToggle" @change="saveSetting('repeatVideo', $event)" />
                            Lặp lại video
                        </label>
                        <label>
                            <input type="checkbox" id="repeatListToggle" @change="saveSetting('repeatList', $event)" />
                            Lặp lại danh sách
                        </label>
                    </div>
                </div>

                <div class="footer">
                    © <a href="https://hoctructuyen.id.vn" style="color: white;">Học Trực Tuyến</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentGroup: "K4",
            currentPlaylist: 0,
            currentIndex: 0,
            videoList: [
                {
                    title: "Flashcard Friends 1",
                    path: "Flashcard Friends 1.mp4",
                },
                {
                    title: "K4 : Lesson 1_Skills Development",
                    path: "Flashcard Friends 2.mp4",
                },
                {
                    title: "K4 : Lesson 1_Bible",
                    path: "Flashcard Friends 3.mp4",
                },
                {
                    title: "GS3_Black",
                    path: "GS3_Black.mp4",
                },
                {
                    title: "GS3_Colors Everywhere!",
                    path: "GS3_Colors Everywhere!.mp4",
                },
                {
                    title: "GS3_Black",
                    path: "GS3_Black.mp4",
                },
                {
                    title: "GS3_Black",
                    path: "GS3_Black.mp4",
                },
                {
                    title: "GS3_Black",
                    path: "GS3_Black.mp4",
                },
                {
                    title: "GS3_Black",
                    path: "GS3_Black.mp4",
                },
                {
                    title: "GS3_Black",
                    path: "GS3_Black.mp4",
                },
                {
                    title: "GS3_Black",
                    path: "GS3_Black.mp4",
                },

            ],
        };
    },
    mounted() {
        this.videoElement = document.getElementById("videoPlayer");
        this.repeatToggle = document.getElementById("repeatToggle");
        this.repeatListToggle = document.getElementById("repeatListToggle");

        this.repeatToggle.checked = localStorage.getItem("repeatVideo") === "true";
        this.repeatListToggle.checked = localStorage.getItem("repeatList") === "true";

        this.playVideoByIndex(this.currentIndex);

        this.videoElement.addEventListener("ended", this.onVideoEnded);
    },
    methods: {
        onGroupChange(e) {
            const group = e.target.value;
            window.location.search = "?group=" + group;
        },
        onPlaylistChange(e) {
            const url = new URL(window.location.href);
            url.searchParams.set("group", this.currentGroup);
            url.searchParams.set("playlist", e.target.value);
            window.location.href = url.toString();
        },
        onVideoChange(e) {
            const index = parseInt(e.target.value);
            this.playVideoByIndex(index);
        },
        saveSetting(key, e) {
            localStorage.setItem(key, e.target.checked);
        },
        playVideoByIndex(index) {
            const wasFullscreen = document.fullscreenElement != null;
            const newVideo = this.videoList[index];
            const sourceType = newVideo.path.includes(".mp4") ? "video/mp4" : "application/x-mpegURL";

            this.videoElement.pause();
            this.videoElement.innerHTML = "";

            const newSource = document.createElement("source");
            newSource.src = newVideo.path;
            newSource.type = sourceType;
            this.videoElement.appendChild(newSource);

            this.videoElement.load();
            this.videoElement.play();

            this.currentIndex = index;

            // Update select dropdown
            this.$refs.videoSelect.value = index;

            if (wasFullscreen) {
                this.videoElement.requestFullscreen().catch(() => { });
            }
        },
        onVideoEnded() {
            const repeatVideo = this.repeatToggle.checked;
            const repeatList = this.repeatListToggle.checked;

            if (repeatVideo) {
                this.videoElement.currentTime = 0;
                this.videoElement.play();
            } else {
                let nextIndex = this.currentIndex + 1;
                if (nextIndex >= this.videoList.length) {
                    if (repeatList) nextIndex = 0;
                    else return;
                }
                this.playVideoByIndex(nextIndex);
            }
        },
    },
};
</script>

<style>
video {
    width: 100%;
    max-width: 800px;
}
</style>