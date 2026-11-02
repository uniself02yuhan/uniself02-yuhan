# 고전의 서재 · ARCHIVE 100

국내외 6대 기관(서울대·고려대·연세대·미국 대학위원회·뉴욕타임스·랜덤하우스) 추천 목록을 종합한 **고전문학 100선** 기반 맞춤형 도서 추천, 3단 줄거리 요약, 독서 기록장 및 독서 모임 웹 애플리케이션입니다.

---

## 1. 내 컴퓨터(로컬)에서 실행하는 방법

GitHub 저장소를 클론(또는 다운로드)한 뒤 아래 명령어를 순서대로 실행하세요. (Node.js 18 이상 필요)

```bash
# 1) 저장소 복제 및 폴더 이동
git clone <내-깃허브-저장소-주소>
cd <저장소-폴더명>

# 2) 패키지 설치
npm install

# 3) 개발 서버 실행 (http://localhost:3000)
npm run dev
```

브라우저에서 **`http://localhost:3000`** 으로 접속하면 바로 실행됩니다.

---

## 2. GitHub Pages로 웹에서 바로 켜는 방법 (무료 배포)

이 프로젝트에는 GitHub Pages 자동 배포 설정(`.github/workflows/deploy.yml`)과 상대 경로 빌드(`base: './'`)가 이미 포함되어 있습니다.

1. GitHub 저장소에 코드를 푸시(`git push`)합니다.
2. GitHub 저장소 상단 메뉴에서 **`Settings`** → 왼쪽 메뉴 **`Pages`** 로 이동합니다.
3. **Build and deployment** 항목의 **Source**를 **`GitHub Actions`** 로 변경합니다.
4. 상단 **`Actions`** 탭에서 `Deploy to GitHub Pages` 워크플로우가 완료되면(약 1분 소요), 생성된 **`https://<아이디>.github.io/<저장소이름>/`** 주소로 언제든 접속할 수 있습니다.
