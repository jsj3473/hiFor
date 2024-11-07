
export default {
data() {
    return {
    userId: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    };
},
methods: {
    handleCancel() {
    this.$router.push('/'); // 메인 페이지로 이동
    },
    handleSubmit() {

    const token = sessionStorage.getItem('token'); // 토큰 가져오기
    const userId = sessionStorage.getItem('userId'); // userId 가져오기 (올바른 값을 확인하세요)
    
    fetch('http://localhost:3000/auth/updatePassword', {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // JWT 토큰 추가
        },
        body: JSON.stringify({
        userId: userId, // 필요시 사용자 ID 추가
        password: this.password,
        newPassword: this.newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
        alert(data.message);
        }
    })
    .catch(error => {
        console.error('비밀번호 변경 오류:', error);
        alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
    });
},
},
};
