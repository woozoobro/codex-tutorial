# Inflearn Cover Motion Export Notes

이 문서는 `docs/inflearn-cover-motion.html`로 만든 3초짜리 인프런 커버 모션을 안정적으로 추출하는 방법을 기록한다.

## 핵심 접근

`agent-browser record`로 브라우저 화면을 녹화하지 않는다.

record 방식은 WebM duration과 fps가 도구 내부 구현에 끌려갈 수 있어서, 이번 작업에서는 10fps로 찍히거나 3초 녹화가 훨씬 긴 영상으로 저장되는 문제가 있었다.

대신 HTML 애니메이션을 특정 시점으로 고정하고, 30fps 기준으로 90장의 PNG 프레임을 직접 캡처한 뒤 `ffmpeg`로 WebM을 만든다.

## HTML Export Mode

`docs/inflearn-cover-motion.html`에는 export mode가 들어 있다.

```text
file:///.../docs/inflearn-cover-motion.html?export=1&t=1500
```

동작 방식:

- `export=1`이면 페이지 로드 후 모든 CSS 애니메이션을 pause한다.
- `t` 값은 밀리초 단위의 애니메이션 시점이다.
- `window.__setExportTime(ms)`를 호출하면 모든 animation의 `currentTime`을 해당 시점으로 고정한다.

이 덕분에 0ms, 33.3ms, 66.6ms처럼 원하는 프레임 시점을 정확히 캡처할 수 있다.

## Export Script

재실행용 스크립트:

```bash
node scripts/export-inflearn-cover-motion-agent-browser.mjs
```

스크립트가 하는 일:

- `agent-browser` viewport를 `1200x781`로 설정한다.
- export mode로 HTML을 연다.
- 3초 × 30fps = 90장 PNG를 `/private/tmp/codex-cover-motion-frames`에 저장한다.
- `ffmpeg`로 90장을 WebM으로 묶는다.
- 최종 파일을 `public/inflearn/codex-cover-motion-frame-seq.webm`에 저장한다.
- 마지막에 agent-browser 세션을 닫는다.

## Output Spec

현재 기본 출력:

```text
public/inflearn/codex-cover-motion-frame-seq.webm
```

검증된 값:

```text
codec: vp9
size: 1200x780
fps: 30
duration: 3.000000s
```

원본 커버 비율은 `1200x781`이지만, WebM/MP4 호환성을 위해 인코딩 단계에서 하단 1px을 crop해서 `1200x780`으로 만든다.

## 검증 명령

```bash
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=codec_name,width,height,r_frame_rate,avg_frame_rate,nb_frames \
  -show_entries format=duration,size \
  -of default=nw=1 \
  public/inflearn/codex-cover-motion-frame-seq.webm
```

샘플 프레임을 보고 싶으면:

```bash
ffmpeg -y \
  -i public/inflearn/codex-cover-motion-frame-seq.webm \
  -vf "select='eq(n,0)+eq(n,45)+eq(n,89)'" \
  -vsync 0 \
  /private/tmp/codex-cover-motion-webm-check/frame_%02d.png
```

## 주의점

- agent-browser 세션이 남아 있으면 headless Chrome GPU 프로세스가 CPU를 계속 사용할 수 있다.
- 추출 후 `agent-browser session list`로 active session이 없는지 확인한다.
- 인앱 브라우저에서 모션 HTML을 계속 열어두면 Codex 앱 GPU 사용량이 올라갈 수 있다.
- 기존 실패 산출물은 `public/inflearn/codex-cover-motion-*.webm` 또는 `.mp4`에 남아 있을 수 있으니 최종 업로드 파일명은 명확히 확인한다.
