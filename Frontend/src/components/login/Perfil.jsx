import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('/perfil', {
            headers: {
                'Authorization': token
            }
        })
            .then(response => {
                setProfile(response.data);
            })
            .catch(err => {
                setError('No autenticado');
            });
    }, []);

    return (
        <div>
            {error ? <p>{error}</p> : <h2>Perfil: {profile && profile.userId}</h2>}
        </div>
    );
}

export default Profile;
