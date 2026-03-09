def register_user(client, email='login.user@example.com', password='Strong!Pass1'):
    return client.post(
        '/auth/register',
        json={'email': email, 'password': password},
    )


def test_login_success_sets_access_and_refresh_cookies(client):
    register_user(client, email='login.success@example.com')

    response = client.post(
        '/auth/login',
        json={'email': 'login.success@example.com', 'password': 'Strong!Pass1', 'remember_me': True},
    )

    assert response.status_code == 200
    body = response.get_json()
    assert body['message'] == 'Login successful.'
    assert body['user']['email'] == 'login.success@example.com'

    set_cookies = response.headers.getlist('Set-Cookie')
    assert any('todo_access_token=' in c and 'HttpOnly' in c for c in set_cookies)
    assert any('todo_refresh_token=' in c and 'HttpOnly' in c for c in set_cookies)


def test_login_invalid_credentials_returns_401(client):
    register_user(client, email='login.invalid@example.com')

    response = client.post(
        '/auth/login',
        json={'email': 'login.invalid@example.com', 'password': 'Wrong!Pass1'},
    )

    assert response.status_code == 401
    assert response.get_json()['error'] == 'Invalid credentials.'


def test_login_non_registered_returns_401(client):
    response = client.post(
        '/auth/login',
        json={'email': 'missing.user@example.com', 'password': 'Strong!Pass1'},
    )

    assert response.status_code == 401
    assert response.get_json()['error'] == 'Invalid credentials.'


def test_refresh_requires_refresh_cookie(client):
    response = client.post('/auth/refresh', json={})
    assert response.status_code == 401


def test_refresh_renews_access_cookie(client):
    register_user(client, email='refresh.user@example.com')
    client.post(
        '/auth/login',
        json={'email': 'refresh.user@example.com', 'password': 'Strong!Pass1', 'remember_me': True},
    )

    response = client.post('/auth/refresh', json={})
    assert response.status_code == 200
    set_cookies = response.headers.getlist('Set-Cookie')
    assert any('todo_access_token=' in c and 'HttpOnly' in c for c in set_cookies)


def test_me_endpoint_requires_valid_access_token(client):
    response = client.get('/auth/me')
    assert response.status_code == 401


def test_me_endpoint_returns_user_when_logged_in(client):
    register_user(client, email='me.user@example.com')
    client.post(
        '/auth/login',
        json={'email': 'me.user@example.com', 'password': 'Strong!Pass1'},
    )

    response = client.get('/auth/me')
    assert response.status_code == 200
    assert response.get_json()['email'] == 'me.user@example.com'


def test_logout_clears_auth_cookies(client):
    register_user(client, email='logout.user@example.com')
    client.post(
        '/auth/login',
        json={'email': 'logout.user@example.com', 'password': 'Strong!Pass1'},
    )

    response = client.post('/auth/logout', json={})
    assert response.status_code == 200
    set_cookies = response.headers.getlist('Set-Cookie')
    assert any('todo_access_token=;' in c for c in set_cookies)
    assert any('todo_refresh_token=;' in c for c in set_cookies)


def test_api_auth_login_alias_works(client):
    register_user(client, email='alias.user@example.com')
    response = client.post(
        '/api/auth/login',
        json={'email': 'alias.user@example.com', 'password': 'Strong!Pass1'},
    )
    assert response.status_code == 200
